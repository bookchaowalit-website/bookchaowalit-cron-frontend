import { NextRequest, NextResponse } from 'next/server';

interface MCPRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    arguments?: any;
  };
}

interface MCPResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

const initialized = false;
const tools = [
  {
    name: "cron_validate",
    description: "Validate cron expression",
    inputSchema: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "Cron expression (e.g., '0 0 * * *')"
        }
      },
      required: ["expression"]
    }
  },
  {
    name: "cron_next_run",
    description: "Get next run time for cron expression",
    inputSchema: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "Cron expression"
        },
        count: {
          type: "number",
          description: "Number of next runs to return",
          default: 5
        }
      },
      required: ["expression"]
    }
  },
  {
    name: "cron_describe",
    description: "Describe what cron expression means",
    inputSchema: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "Cron expression to describe"
        }
      },
      required: ["expression"]
    }
  },
  {
    name: "cron_schedule_builder",
    description: "Build cron expression from visual schedule",
    inputSchema: {
      type: "object",
      properties: {
        minute: {
          type: "string",
          description: "Minute field (0-59)"
        },
        hour: {
          type: "string",
          description: "Hour field (0-23)"
        },
        day: {
          type: "string",
          description: "Day of month field (1-31)"
        },
        month: {
          type: "string",
          description: "Month field (1-12 or JAN-DEC)"
        },
        weekday: {
          type: "string",
          description: "Day of week field (0-7 or SUN-SAT)"
        }
      },
      required: ["minute", "hour", "day", "month", "weekday"]
    }
  }
];

export async function POST(request: NextRequest) {
  let requestId: number | string = 0;

  try {
    const body: MCPRequest = await request.json();
    requestId = body.id;

    if (body.jsonrpc !== "2.0") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: requestId,
        error: {
          code: -32600,
          message: "Invalid Request"
        }
      } as MCPResponse, { status: 400 });
    }

    const response: MCPResponse = {
      jsonrpc: "2.0",
      id: requestId
    };

    switch (body.method) {
      case "initialize":
        response.result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          }
        };
        break;

      case "tools/list":
        response.result = { tools };
        break;

      case "tools/call":
        if (!body.params?.arguments) {
          response.error = {
            code: -32602,
            message: "Invalid params: arguments required"
          };
          break;
        }

        const { arguments: args } = body.params;

        try {
          switch (body.params.name) {
            case "cron_validate":
              if (!isValidCronExpression(args.expression)) {
                response.error = {
                  code: -32602,
                  message: "Invalid cron expression"
                };
              } else {
                response.result = {
                  valid: true,
                  message: "Valid cron expression"
                };
              }
              break;

            case "cron_next_run":
              if (!isValidCronExpression(args.expression)) {
                response.error = {
                  code: -32602,
                  message: "Invalid cron expression"
                };
              } else {
                const nextRuns = getNextRunTimes(args.expression, args.count || 5);
                response.result = {
                  expression: args.expression,
                  nextRuns: nextRuns,
                  timezone: "UTC"
                };
              }
              break;

            case "cron_describe":
              if (!isValidCronExpression(args.expression)) {
                response.error = {
                  code: -32602,
                  message: "Invalid cron expression"
                };
              } else {
                const description = describeCronExpression(args.expression);
                response.result = {
                  expression: args.expression,
                  description: description,
                  humanReadable: description
                };
              }
              break;

            case "cron_schedule_builder":
              const cron = `${args.minute} ${args.hour} ${args.day} ${args.month} ${args.weekday}`;
              response.result = {
                cron: cron,
                description: describeCronExpression(cron)
              };
              break;

            default:
              response.error = {
                code: -32601,
                message: `Unknown tool: ${body.params.name}`
              };
          }
        } catch (error) {
          response.error = {
            code: -32603,
            message: "Internal error"
          };
        }
        break;

      default:
        response.error = {
          code: -32601,
          message: `Method not found: ${body.method}`
        };
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: requestId,
      error: {
        code: -32603,
        message: "Internal error"
      }
    } as MCPResponse, { status: 500 });
  }
}

function isValidCronExpression(expression: string): boolean {
  const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])(,[0-9-]+)*|\*\/([0-9]+))\s+(\*|([0-9]|1[0-9]|2[0-3])(,[0-9-]+)*|\*\/([0-9]+))\s+(\*|([1-9]|[1-2][0-9]|3[0-1])(,[0-9-]+)*|\*\/([0-9]+))\s+(\*|([1-9]|1[0-2])(,[0-9-]+)*|\*\/([0-9]+))\s+(\*|([0-7])(,[0-7-]+)*|\*\/([0-9]+))$/;
  return cronRegex.test(expression);
}

function getNextRunTimes(expression: string, count: number): string[] {
  const nextRuns: string[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const next = calculateNextRun(expression, now);
    if (next) {
      nextRuns.push(next.toISOString());
      now.setTime(next.getTime() + 60000); // Add 1 minute to avoid duplicates
    }
  }

  return nextRuns;
}

function calculateNextRun(expression: string, fromDate: Date): Date | null {
  try {
    const [minute, hour, day, month, weekday] = expression.split(' ');

    // This is a simplified implementation for demonstration
    // In production, use a proper cron library like node-cron

    let next = new Date(fromDate);
    next.setSeconds(0);
    next.setMilliseconds(0);

    // Increment time until we find a match
    for (let attempts = 0; attempts < 1000; attempts++) {
      if (matchesCronField(next, minute, 0, 59) &&
          matchesCronField(next, hour, 0, 23) &&
          matchesCronField(next, day, 1, 31) &&
          matchesCronField(next, month, 1, 12) &&
          matchesCronField(next, weekday, 0, 7)) {
        return next;
      }

      next.setMinutes(next.getMinutes() + 1);

      // Reset to next day if we've gone through the whole day
      if (next.getMinutes() === 0) {
        next.setDate(next.getDate() + 1);
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

function matchesCronField(date: Date, field: string, min: number, max: number): boolean {
  let value = field === 'minute' ? date.getMinutes() :
                   field === 'hour' ? date.getHours() :
                   field === 'day' ? date.getDate() :
                   field === 'month' ? date.getMonth() + 1 :
                   date.getDay();

  if (field === 'weekday' && value === 0) value = 7;

  if (field === '*') return true;
  if (field.startsWith('*/')) {
    const step = parseInt(field.slice(2));
    return value % step === 0;
  }

  const values = field.split(',');
  return values.some(v => {
    if (v.includes('-')) {
      const [start, end] = v.split('-').map(Number);
      return value >= start && value <= end;
    }
    return value === parseInt(v);
  });
}

function describeCronExpression(expression: string): string {
  const [minute, hour, day, month, weekday] = expression.split(' ');

  const descriptions = {
    minute: minute === '*' ? 'every minute' :
             minute === '0' ? 'at minute 0' :
             minute.includes('*') ? `every ${minute.slice(2)} minutes` :
             `at minutes ${minute}`,
    hour: hour === '*' ? 'every hour' :
           hour.includes('*') ? `every ${hour.slice(2)} hours` :
           `at hours ${hour}`,
    day: day === '*' ? 'every day' :
          day.includes('*') ? `every ${day.slice(2)} days` :
          `on day(s) ${day}`,
    month: month === '*' ? 'every month' :
            month.includes('*') ? `every ${month.slice(2)} months` :
            `in month(s) ${month}`,
    weekday: weekday === '*' ? 'every day' :
             weekday.includes('*') ? `every ${weekday.slice(2)} days` :
             `on day(s) ${weekday}`
  };

  return `${descriptions.minute}, ${descriptions.hour}, ${descriptions.day}, ${descriptions.month}, ${descriptions.weekday}`;
}
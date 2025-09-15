const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/g;
const PHONE_REGEX = /(?:(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3}[\s-]?\d{2,4}[\s-]?\d{2,4})/g;
const OPENAI_KEY_REGEX = /sk-[A-Za-z0-9]{20,}/g;
const AWS_ACCESS_KEY_REGEX = /AKIA[0-9A-Z]{16}/g;
const PRIVATE_KEY_BLOCK = /-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----/g;

export interface RedactOptions {
  enabled?: boolean;
}

export function redactSensitive(input: string, opts: RedactOptions = {}): { redacted: string; redactedCount: number } {
  if (!opts.enabled) return { redacted: input, redactedCount: 0 };
  let text = input;
  let count = 0;
  const rules: Array<{ re: RegExp; repl: string }> = [
    { re: PRIVATE_KEY_BLOCK, repl: '[REDACTED:PRIVATE_KEY]' },
    { re: OPENAI_KEY_REGEX, repl: '[REDACTED:OPENAI_KEY]' },
    { re: AWS_ACCESS_KEY_REGEX, repl: '[REDACTED:AWS_ACCESS_KEY]' },
    { re: EMAIL_REGEX, repl: '[REDACTED:EMAIL]' },
    { re: PHONE_REGEX, repl: '[REDACTED:PHONE]' },
  ];

  for (const { re, repl } of rules) {
    const before = text;
    text = text.replace(re, () => {
      count += 1;
      return repl;
    });
    if (before === text) continue;
  }
  return { redacted: text, redactedCount: count };
}


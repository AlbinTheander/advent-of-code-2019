async function runDay(day: number): Promise<void> {
  const module = await import(`./src/day${day}`);
  module.default();
}

async function runAllDays(): Promise<void> {
  for (let day = 1; day <= 25; day++) {
    try {
      await runDay(day);
    } catch {}
  }
}

const day = process.argv[2];
if (day) runDay(+day);
else runAllDays();

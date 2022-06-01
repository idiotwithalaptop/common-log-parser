export class StringOccuranceCounter {
  private readonly occurances: Map<string, number>;

  constructor() {
    this.occurances = new Map<string, number>();
  }

  add(value: string): number {
    let count = 0;
    if (this.occurances.has(value)) {
      count = this.occurances.get(value);
    }
    const occuranceCount = ++count;
    this.occurances.set(value, occuranceCount);
    return occuranceCount;
  }

  count(): number {
    return this.occurances.size;
  }

  getTopOccurances(maximum: number): Array<string> {
    const topOccurances = Array.from(this.occurances.entries())
      .sort((valueA, valueB) => {
        return valueB[1] - valueA[1];
      })
      .slice(0, maximum)
      .map((occurance) => occurance[0]);
    return topOccurances;
  }

  getTopOccurancesString(maximum: number): string {
    return this.getTopOccurances(maximum).reduce((previous, current, index) => {
      if (index === 0) {
        return ` - ${current}`;
      } else {
        return `${previous}\n - ${current}`;
      }
    }, "");
  }
}

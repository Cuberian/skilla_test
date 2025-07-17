export class CyclicOrder<T extends readonly (string | number | symbol | null)[]> {
    private valueToIndex: Map<T[number], number>;
    private indexToValue: Map<number, T[number]>;
    private readonly total: number;

    constructor(values: T) {
        this.valueToIndex = new Map();
        this.indexToValue = new Map();

        values.forEach((value, i) => {
            const index = i + 1;
            this.valueToIndex.set(value, index);
            this.indexToValue.set(index, value);
        });

        this.total = values.length;
    }

    getNext(current: T[number]): T[number] {
        const currentIndex = this.valueToIndex.get(current) as number;
        const nextIndex = (currentIndex % this.total) + 1;
        return this.indexToValue.get(nextIndex) as T[number];
    }

    getPrev(current: T[number]): T[number] {
        const currentIndex = this.valueToIndex.get(current) as number;
        const prevIndex = (currentIndex - 2 + this.total) % this.total + 1;
        return this.indexToValue.get(prevIndex) as T[number];
    }
}
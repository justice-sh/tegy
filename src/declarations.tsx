export const declare = "declare";

declare global {
	interface Window {
		border: (color?: string) => string;
		theme: Theme;
	}

	type ThemeField = "primary" | "secondary";

	interface Theme {
		primary: string;
		secondary: string;
	}

	type BudgetType = "income" | "expense";

	interface BudgetRemove {
		budget: Budget;
		amountId: string;
	}

	interface Budget {
		id: string;
		description: string;
		type: BudgetType;
		amounts: { amount: number; date: number; id: string }[];
	}

	interface BudgetFind {
		type: BudgetType;
		id?: string;
		description?: string;
	}

	interface BudgetSlice {
		id: string;
		name: string;
		selectedBatch: string;
		batches: Batch[];
	}

	interface BatchTotal {
		income: number;
		expense: number;
	}

	interface Batch {
		id: string;
		name: string;
		income: Budget[];
		expense: Budget[];
		total: BatchTotal;
		date: {
			start: number;
			end: number;
		};
	}

	interface SelectOption {
		value: string;
		label: string;
	}
}

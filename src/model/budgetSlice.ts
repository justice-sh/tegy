import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { getItem, sumItem } from "../utils/budgetItem";
import { getBatch, createBatch, getTotal } from "../utils/batch";
import { getBudget } from "../utils/budget";

const batch = createBatch(
	"batch 1",
	{ start: new Date(), end: new Date() },
	"u18882929838383id"
);

const budget: Budget = {
	id: "u93838938838383id",
	name: "default",
	batches: [batch],
	batchList: [{ id: batch.id, name: batch.name }],
	head: batch.id
};

export const initialState: Budgets = {
	budgets: [budget],
	descriptions: [],
	heads: {
		budget: budget.id,
		batch: budget.head
	},
	budgetList: [{ id: budget.id, name: budget.name }]
};

const budgetSlice = createSlice({
	name: "budgets",

	initialState,

	reducers: {
		stateLoaded: (state, { payload }: PayloadAction<Budgets>) => {
			return payload;
		},

		itemAdded: (state, { payload }: PayloadAction<BudgetItem>) => {
			const batch = getBatch(state);

			if (!batch) return state;

			const { type, description, amounts } = payload;

			const item = getItem({ type, description }, state, batch);

			if (item) {
				item.amounts = [...item.amounts, ...amounts];
			} else {
				batch[type].push(payload);
				state.descriptions.push(item.description);
			}

			batch.total = getTotal(batch);
		},

		itemRemoved: (state, { payload }: PayloadAction<BudgetItem>) => {
			const { id, type, description, amounts } = payload;
			const amountId = amounts[0].id;

			const batch = getBatch(state);

			if (!batch) return state;

			const item = getItem({ type, id, description }, state, batch);

			if (item.amounts.length > 1) {
				item.amounts = item.amounts.filter(a => a.id !== amountId);
			} else {
				batch[type] = batch[type].filter(b => b.id !== id);
				state.descriptions = state.descriptions.filter(
					d => item.description !== d
				);
			}

			batch.total = getTotal(batch);
		},

		totalUpdated: (state, { payload }: PayloadAction<ItemFind>) => {
			const batch = getBatch(state);
			batch.total = sumItem([getItem(payload, state, batch)]);
		},

		headsUpdated: (state, { payload }: PayloadAction<Heads>) => {
			state.heads = payload;
			getBudget(state).head = payload.batch;
		},

		batchCreated: (state, { payload }: PayloadAction<Batch>) => {
			const budget = getBudget(state);
			budget.batches.push(payload);
			state.heads.batch = payload.id;
			budget.head = payload.id;
			budget.batchList.push({ id: payload.id, name: payload.name });
		},

		batchUpdated: (state, { payload }: PayloadAction<Batch>) => {
			const batch = getBatch(state);
			batch.name = payload.name;
			batch.date = payload.date;

			const budget = getBudget(state);
			budget.batchList = budget.batches.map(b => ({ id: b.id, name: b.name }));
		},

		batchLoaded: (state, { payload }: PayloadAction<Batch>) => {
			getBudget(state).batches.push(payload);
		},

		batchRemoved: (state, { payload }: PayloadAction<{ id: string }>) => {
			const budget = getBudget(state);

			budget.batches = budget.batches.filter(b => b.id !== payload.id);

			budget.batchList = budget.batchList.filter(b => b.id !== payload.id);

			budget.head = budget.batchList[0].id;
			state.heads.batch = budget.batchList[0].id;
		},

		budgetCreated: (state, { payload }: PayloadAction<Budget>) => {
			state.budgets.push(payload);

			state.heads = {
				batch: payload.batches[0].id,
				budget: payload.id
			};

			state.budgetList.push({ id: payload.id, name: payload.name });
		},

		budgetLoaded: (state, { payload }: PayloadAction<Budget>) => {
			const { id, head } = payload;

			state.heads = { budget: id, batch: head };
			state.budgets.push(payload);
		},

		budgetModified: (state, { payload }: PayloadAction<Budget>) => {
			const b = getBudget(state);

			// update budgets
			const index = state.budgets.indexOf(b);
			state.budgets[index] = { ...payload };

			// update budgetList
			state.budgetList.find(b => b.id === payload.id).name = payload.name;
		},

		budgetRemoved: (state, { payload }: PayloadAction<Budget>) => {
			// remove from budgets
			state.budgets = state.budgets.filter(b => b.id !== payload.id);

			// remove from budgetList
			state.budgetList = state.budgetList.filter(b => b.id !== payload.id);

			// update heads
			state.heads = {
				budget: state.budgets[0].id,
				batch: state.budgets[0].head
			};
		},

		descriptionsLoaded: (state, { payload }: PayloadAction<string[]>) => {
			state.descriptions = payload;
		}
	}
});

export const {
	itemAdded,
	itemRemoved,
	totalUpdated,
	batchCreated,
	batchLoaded,
	batchUpdated,
	batchRemoved,
	headsUpdated,
	stateLoaded,
	budgetCreated,
	budgetLoaded,
	budgetModified,
	budgetRemoved,
	descriptionsLoaded
} = budgetSlice.actions;

export const selectItem = (param: ItemFind) => (state: RootState) => {
	return getItem(param, state.budgets);
};

export const selectDescriptions = (state: RootState) =>
	state.budgets.descriptions;

export const selectBatch = (state: RootState): Batch => {
	return getBatch(state.budgets);
};

export const selectBatchTotal = (state: RootState) => {
	return getBatch(state.budgets)?.total ?? { income: 0, expense: 0 };
};

export const selectHeads = (state: RootState) => state.budgets.heads;

export const selectBatchList = (state: RootState): SelectOption[] => {
	return (
		getBudget(state.budgets)?.batchList.map(batch => ({
			label: batch.name,
			value: batch.id
		})) ?? []
	);
};

export const selectBudget = (state: RootState) => getBudget(state.budgets);

export const selectBudgetList = (state: RootState) => state.budgets.budgetList;

export default budgetSlice.reducer;

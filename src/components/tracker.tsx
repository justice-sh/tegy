import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import {
	batchLoaded,
	selectBatch,
	selectBatchTotal,
	selectBudget
} from "../model/budgetSlice";
import { useAppDispatch, useAppSelector } from "../model/hooks";
import { getBatch } from "../services/batchService";
import Header from "./header";
import NoBudget from "./empty/noBudget";
import BudgetView from "./budgetView";
import BudgetInput from "./budgetInput";
import Banner from "./common/banner";
import SummaryLabel from "./common/summaryLabel";
import BudgetList from "./common/budgetList";
import { animeBalance } from "../utils/tracker";

function Tracker() {
	const dispatch = useAppDispatch();

	const batch = useAppSelector(selectBatch);
	const budget = useAppSelector(selectBudget);

	const noData = batch
		? batch.income.length === 0 && batch.expense.length === 0
		: true;

	useEffect(() => {
		if (!batch) {
			dispatch(dispatch => {
				getBatch().then(batch => {
					dispatch(batchLoaded(batch));
				});
			});
		}
	}, [batch, dispatch]);

	const { income: inc, expense: exp } = useAppSelector(selectBatchTotal);

	useEffect(() => {
		animeBalance("banner-amount", inc - exp);
	}, [inc, exp]);

	return (
		<Wrapper>
			<ToastContainer theme="colored" position="top-center" />

			<Header />

			<Banner>
				<div className="banner-content">
					<div className="banner-title">
						Balance of <span className="banner-title-sub">{budget.name}</span>{" "}
						Budget
					</div>

					<div className="banner-amount">
						{/* {formatAmount(total.income - total.expense, "+")} */}
					</div>

					<SummaryLabel type="income" name="income" />

					<SummaryLabel color="secondary" type="expense" name="expense" />
				</div>
			</Banner>

			<BudgetInput />

			<div className="tracker-content">
				<Switch>
					<Route path="/view/:type/:id">
						<BudgetView />
					</Route>

					<Route path="/">
						{noData ? (
							<NoBudget />
						) : (
							<>
								<BudgetList
									title="Income"
									color="primary"
									items={batch?.income ?? []}
								/>
								<BudgetList
									title="Expense"
									color="secondary"
									items={batch?.expense ?? []}
								/>
							</>
						)}
					</Route>
				</Switch>
			</div>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	.banner-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		color: white;
	}
	.banner-title {
		font-size: min(25px, 8vw);
		font-weight: 300;
	}
	.banner-title-sub {
		text-transform: capitalize;
	}
	.banner-amount {
		font-size: min(50px, 15vw);
		margin: 10px 0;
	}

	.tracker-content {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
`;

export default Tracker;

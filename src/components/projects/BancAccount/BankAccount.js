import React, { useEffect, useReducer, useRef } from "react";
import "./bankaccount.css";

const initialState = {
  users: [],
  Loginuser: {},
  status: "getLoginForm",
  err: "",
  deposit: 0,
  withdraw: 0,
  loanRequest: 0,
  payLoan: 0,
  transaction: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "getUsers":
      return {
        ...state,
        users: action.payload,
        status: "getLoginForm",
        Loginuser: {},
        deposit: 0,
        withdraw: 0,
        payLoan: 0,
        loanRequest: 0,
      };
    case "login":
      return {
        ...state,
        Loginuser: action.payload,
        transaction: null,
        status: "open",
        deposit: 0,
        withdraw: 0,
        payLoan: 0,
        loanRequest: 0,
      };
    case "loginFaild":
      return {
        ...state,
        err: action.payload,
        status: "getLoginForm",
      };
    case "closeAccount":
      return {
        ...state,
        status: "getLoginForm",
        Loginuser: {},
        transaction: null,
      };
    case "updateUserData":
      return {
        ...state,
        Loginuser: action.payload,
      };
    case "deposit":
      return {
        ...state,
        transaction: "deposit_transaction",
      };
    case "setDeposit":
      return {
        ...state,
        deposit: action.payload,
        withdraw: 0,
        payLoan: 0,
        loanRequest: 0,
      };

    case "withdraw":
      return {
        ...state,
        transaction: "withdraw_transaction",
      };
    case "setWithdraw":
      return {
        ...state,
        withdraw: action.payload,
        deposit: 0,
        payLoan: 0,
        loanRequest: 0,
      };
    case "requestLoan":
      return {
        ...state,
        transaction: "requestLoan_transaction",
      };
    case "setLoanRequest":
      return {
        ...state,
        loanRequest: action.payload,
        deposit: 0,
        payLoan: 0,
        withdraw: 0,
      };
    case "payLoan":
      return {
        ...state,
        transaction: "payLoan_transaction",
      };
    case "setPayLoan":
      return {
        ...state,
        payLoan: action.payload,
        deposit: 0,
        loanRequest: 0,
        withdraw: 0,
      };
    case "back":
      return {
        ...state,
        transaction: null,
      };
    default:
      throw new Error("Unknown action");
  }
}

const BankAccount = () => {
  const [
    {
      users,
      Loginuser,
      status,
      err,
      deposit,
      withdraw,
      loanRequest,
      payLoan,
      transaction,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const username = useRef();
  const cardNumber = useRef();

  useEffect(() => {
    fetch("http://localhost:9000/Bank_users")
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "getUsers", payload: data });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const HandleLogin = () => {
    const user = users.find((user) => {
      return (
        user["name"].toLowerCase() === username.current.value.toLowerCase() &&
        user["card_number"] === cardNumber.current.value
      );
    });

    dispatch({ type: "login", payload: users[0] });

    if (user) {
      dispatch({ type: "login", payload: user });
    } else {
      dispatch({
        type: "loginFaild",
        payload: "Username or card number is not valid",
      });
    }
  };

  const HandleSubmit = () => {
    let updatedUserData = {};
    if (transaction === "deposit_transaction") {
      updatedUserData = {
        ...Loginuser,
        balance:
          deposit >= 50 ? Loginuser.balance + deposit : Loginuser.balance,
      };
    } else if (transaction === "withdraw_transaction") {
      updatedUserData = {
        ...Loginuser,
        balance:
          withdraw >= 50 ? Loginuser.balance - withdraw : Loginuser.balance,
      };
    } else if (transaction === "requestLoan_transaction") {
      updatedUserData = {
        ...Loginuser,
        balance:
          loanRequest >= 5000
            ? Loginuser.balance + loanRequest
            : Loginuser.balance,
        loan:
          loanRequest >= 5000 ? Loginuser.loan + loanRequest : Loginuser.loan,
      };
    } else if (transaction === "payLoan_transaction") {
      updatedUserData = {
        ...Loginuser,
        balance:
          payLoan >= 5000 ? Loginuser.balance - payLoan : Loginuser.balance,
        loan: payLoan >= 5000 ? Loginuser.loan - payLoan : Loginuser.loan,
      };
    } else {
      updatedUserData = {
        ...Loginuser,
      };
    }

    fetch(`http://localhost:9000/Bank_users/${Loginuser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          dispatch({ type: "updateUserData", payload: updatedUserData });
        } else {
          console.error("Failed to update user data:", data);
        }
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  return (
    <>
      <div className="bank-account">
        <h1 className="title">{"useReducer Bank Account"}</h1>
        {status === "getLoginForm" && (
          <div className="bank-login">
            <div className="form">
              <h1>Login to your account</h1>
              <input
                ref={username}
                type="text"
                className="login-name"
                autoFocus
                placeholder="User Name..."
              />
              <br />

              <input
                type="text"
                className="login-name"
                autoFocus
                placeholder="Card Number..."
                ref={cardNumber}
              />
              <br />

              <button className="login" onClick={HandleLogin}>
                Login
              </button>
              {err && (
                <h3 style={{ padding: "10px 0", color: "red" }}>{err}</h3>
              )}
            </div>
          </div>
        )}

        {status === "open" && (
          <>
            <table className="user-data">
              <tr>
                <td>Name </td>
                <td>{Loginuser["name"]}</td>
              </tr>

              <tr>
                <td>Balance </td>
                <td>{Loginuser["balance"]}</td>
              </tr>

              <tr>
                <td>Loan </td>
                <td>{Loginuser["loan"]}</td>
              </tr>
            </table>

            <div className="controls">
              {!transaction && (
                <div className="transactions">
                  <button
                    className="btn"
                    onClick={() => dispatch({ type: "deposit" })}
                  >
                    Depost
                  </button>
                  <button
                    className="btn"
                    onClick={() => dispatch({ type: "withdraw" })}
                  >
                    Withdraw
                  </button>
                  <button
                    className="btn"
                    onClick={() => dispatch({ type: "requestLoan" })}
                  >
                    Request Loan
                  </button>
                  <button
                    className="btn"
                    onClick={() => dispatch({ type: "payLoan" })}
                  >
                    Pay Loan
                  </button>
                </div>
              )}
              {transaction === "deposit_transaction" && (
                <div className="form-control">
                  <label>Deposit:</label>
                  <input
                    type="number"
                    placeholder="deposit, amount must greater than or equal 50"
                    onChange={(e) =>
                      dispatch({
                        type: "setDeposit",
                        payload: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}

              {transaction === "withdraw_transaction" && (
                <div className="form-control">
                  <label>Withdraw:</label>
                  <input
                    type="number"
                    placeholder="Withdraw amount must greater than or equal 50"
                    onChange={(e) =>
                      dispatch({
                        type: "setWithdraw",
                        payload: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}

              {transaction === "requestLoan_transaction" && (
                <div className="form-control">
                  <label>Requesst Loan:</label>
                  <input
                    type="number"
                    placeholder="Request for loan..."
                    min={50}
                    onChange={(e) =>
                      dispatch({
                        type: "setLoanRequest",
                        payload: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}

              {transaction === "payLoan_transaction" && (
                <div className="form-control">
                  <label>Pay Loan:</label>
                  <input
                    type="number"
                    placeholder="Pay loan..."
                    onChange={(e) =>
                      dispatch({
                        type: "setPayLoan",
                        payload: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}

              <div className="form-control">
                <input
                  type="button"
                  onClick={HandleSubmit}
                  placeholder="Submit Changes"
                  value="Submit Changes"
                  disabled={transaction ? "" : "false"}
                />
                <button
                  className="btn"
                  onClick={() => dispatch({ type: "back" })}
                >
                  back
                </button>
                <input
                  type="button"
                  onClick={() => dispatch({ type: "closeAccount" })}
                  placeholder="Close Account"
                  value="Close Account"
                />
              </div>
            </div>
          </>
        )}

        {status === "error" && (
          <div className="error">
            <h1>Error 😐 Check Your internet</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default BankAccount;

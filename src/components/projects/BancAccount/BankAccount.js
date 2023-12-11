import React, { useEffect, useReducer, useRef } from "react";
import "./bankaccount.css";

const initialState = {
  users: [],
  Loginuser: {},
  status: "getLoginForm",
  err: "",
  deposit: 50,
  withdraw: 50,
  loanRequest: 5000,
  payLoan: 1000,
};

function reducer(state, action) {
  switch (action.type) {
    case "getUsers":
      return {
        ...state,
        users: action.payload,
        status: "getLoginForm",
      };
    case "login":
      return {
        ...state,
        Loginuser: action.payload,
        status: "open",
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
      };
    // case "updateUserData":
    //   return {
    //     ...state,
    //     Loginuser: action.payload,
    //   };
    case "setDeposit":
      return {
        ...state,
        deposit: action.payload,
      };
    case "setWithdraw":
      return {
        ...state,
        withdraw: action.payload,
      };
    case "setLoanRequest":
      return {
        ...state,
        loanRequest: action.payload,
      };
    case "setPayLoan":
      return {
        ...state,
        payLoan: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

const BankAccount = () => {
  const [
    { users, Loginuser, status, err, deposit, withdraw, loanRequest, payLoan },
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

    // if (user) {
    //   dispatch({ type: "login", payload: user });
    // } else {
    //   dispatch({
    //     type: "loginFaild",
    //     payload: "Username or card number is not valid",
    //   });
    // }
  };

  const HandleSubmit = () => {
    const updatedUserData = {
      ...Loginuser,
      balance: Loginuser.balance + deposit - withdraw,
      loan: Loginuser.loan + loanRequest - payLoan,
    };

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
              <div className="form-control">
                <label>Deposit:</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) =>
                    dispatch({
                      type: "setDeposit",
                      payload: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-control">
                <label>Withdraw:</label>
                <input
                  type="number"
                  placeholder="Withdraw..."
                  min={withdraw}
                  onChange={(e) =>
                    dispatch({
                      type: "setWithdraw",
                      payload: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="form-control">
                <label>Reques Loan:</label>
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
              <div className="form-control">
                <input
                  type="button"
                  onClick={HandleSubmit}
                  placeholder="Submit Changes"
                  value="Submit Changes"
                />
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

import { authService } from "fbase";
import { useState } from "react";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data = null;
      if (newAccount) {
        // create account
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        // log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message.slice(9, error.message.indexOf(".") + 1));
    }
  };
  const onChange = (event) => {
    // Object Destructuring
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="email"
          onChange={onChange}
          placeholder="Email"
          required
          value={email}
          className="authInput"
        />
        <input
          name="password"
          onChange={onChange}
          type="password"
          placeholder="Password"
          required
          minLength="6"
          value={password}
          className="authInput"
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Log in"}
          className="authInput authSubmit"
        />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign in" : "Create Account"}
      </span>
    </>
  );
}

export default AuthForm;

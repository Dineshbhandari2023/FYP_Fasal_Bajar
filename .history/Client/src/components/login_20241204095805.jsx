import React from "react";

const logIn = () => {
  return (
    <div>
      <div>
        <h1>Login</h1>
        <form>
          <label>Username:</label>
          <input type="text" name="username" />
          <br />
          <label>Password:</label>
          <input type="password" name="password" />
          <br />
          <input type="submit" value="Login" />
        </form>
      </div>
      <form>
        <label>Register:</label>
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default logIn;

import React from "react";
import Link from "next/link";
function SignupForm() {
  return (
    <div>
      <form action="">
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Register</button>
      </form>
      <p>
        already member? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}

export default SignupForm;

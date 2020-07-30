import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <Fragment>
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Sign In</h1>
          <p className="lead text-center">Sign Into Your Account</p>
          <form
            action="create-profile.html"
            onSubmit={(e) => {
              onSubmit(e);
            }}>
            <div className="form-group"></div>
            <div className="form-group">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Email Address"
                name="email"
                onChange={(e) => onChange(e)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Password"
                name="password"
                onChange={(e) => onChange(e)}
              />
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" value="Login" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;

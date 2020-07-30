import React, { Fragment, useState } from 'react';
import {connect} from 'react-redux';
import { setAlert } from '../../actions/alert';
import {register} from '../../actions/auth';

const Register = (props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (password != password2) {
      console.log('Password do not match');
      props.setAlert('Password do not match','danger');
    } else {
      props.register({name,email,password})
      console.log(formData);
    }
  };
  return (
    <Fragment>
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Sign Up</h1>
          <p className="lead text-center">Create your DevConnector account</p>
          <form
            action="create-profile.html"
            onSubmit={(e) => {
              onSubmit(e);
            }}>
            <div className="form-group">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Name"
                name="name"
                value={name}
                onChange={(e) => onChange(e)}
                
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Email Address"
                name="email"
                onChange={(e) => onChange(e)}
              />
              <small className="form-text text-muted">
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
              </small>
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
            <div className="form-group">
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Confirm Password"
                name="password2"
                onChange={(e) => onChange(e)}
              />
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default connect(null, { setAlert, register })(Register);

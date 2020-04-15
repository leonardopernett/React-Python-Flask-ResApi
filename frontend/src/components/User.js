import React, { Fragment, useState, useRef, useEffect } from "react";

const API = process.env.REACT_APP_API;

export default function User() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);

  const [editing, setEditing] = useState(false);
  const [Id, setId] = useState();
  const inputElement = useRef(null);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
    getUsers();
  }, []);

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    setUsers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const users = {
      name: name,
      email: email,
      password: password,
    };

    if (!editing) {
      const res = await fetch(`${API}/users`, {
        method: "POST",
        body: JSON.stringify(users),
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    }else{
      const res = await fetch(`${API}/users/${Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(users),
      });
      const data = await res.json();
      console.log(data);
    }
    setEditing(false);
    getUsers();
    setName("");
    setEmail("");
    setPassword("");
  };

  const deleteUser = async (id) => {
    if (window.confirm("are you sure than deleted")) {
      const res = await fetch(`${API}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      await getUsers();
    }
  };

  const editUser = async (id) => {
    const res = await fetch(`${API}/users/${id}`);
    const data = await res.json();
    setName(data.name);
    setEmail(data.email);
    setPassword(data.password);
    setId(id);
    setEditing(true);
  };

  const renderUser = (users) => {
    return users.map(({ name, email, _id }) => (
      <tr key={_id}>
        <td className="lead">{name}</td>
        <td className="lead">{email}</td>
        <td>
          <button
            className="btn btn-danger btn-sm "
            onClick={() => deleteUser(_id)}
          >
            delete
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={() => editUser(_id)}
          >
            edit
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <Fragment>
      <div className="row p-4">
        <div className="col-md-4 col-sm-12">
          <div className="card card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                  ref={inputElement}
                  value={name}
                  placeholder="name"
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="email"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="*****"
                />
              </div>
              <button className="btn btn-primary btn-block">create user</button>
            </form>
          </div>
        </div>
        <div className="col-md-8 col-sm-12">
          <table className="table">
            <thead>
              <tr>
                <th>name</th>
                <th>email</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>{renderUser(users)}</tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}

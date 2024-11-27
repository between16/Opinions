import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import HomeButton from "./HomeButton";
import "./UserUpdate.css"

type Params = {
    type: "username" | "password"; // Specifica i valori accettabili
  };

const UserUpdate = () => {
    const type = useParams<Params>().type || "username";
    // Extract the last part of the URL (username or password)
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const oldUsername = localStorage.getItem('username'); // Retrieve username from local storage

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
      
        const endpoint = type === "username" ? "updateUsername" : "updatePassword";
      
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newValue: value, 
              oldUsername: oldUsername, 
            }),
          });
      
          const data = await response.json();
          if (response.ok) {
            alert("Update successful");
            navigate("/Home/User"); // Redirect alla homepage o posizione desiderata
            if (type === "username") {
                localStorage.setItem("username", value);
              } else {
                console.log("update");
              }              
          } else {
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("An error occurred while updating. Please try again.");
        }
      };
      

  return (
    <>
      <HomeButton />
      <h2 className="update-h2">Update {type === "username" ? "Username" : "Password"}</h2>
      <div className="update-div">
      <form className= "update-form" onSubmit={handleSubmit}>
        <label className="update-label" htmlFor="value">{`New ${type}:`}</label>
        <input
          placeholder="Username"
          type={type === "password" ? "password" : "text"}
          id="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <button className= "update-button" type="submit">Submit</button>
      </form>
      </div>
    </>
  );
};

export default UserUpdate;

import { authService, dbService } from "fbase";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Profile({ userObj, refreshUser }) {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMysTwitters = async () => {
    await dbService
      .collection("simple-twitter")
      .where("creatorID", "==", userObj.uid)
      .orderBy("createAt")
      .get();
    // console.log(sTwitters.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMysTwitters();
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
        // photoURL: ...
      });
      refreshUser();
    } else {
      alert("변경할 이름과 입력된 이름이 같습니다.");
    }
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  return (
    <div className="container">
      {/* Profile Image */}
      <img
        src={userObj.photoURL}
        alt=""
        width="150px"
        height="150px"
        style={{ borderRadius: "50%" }}
        required
        className="profileImg"
      />
      <br />
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder={`${newDisplayName} (Display name)`}
          required
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;

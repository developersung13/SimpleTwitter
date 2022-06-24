import STwitter from "components/STwitter";
import STwitterFactory from "components/STwitterFactory";
import { dbService } from "fbase";
import { useEffect, useState } from "react";

function Home({ userObj }) {
  const [stwitters, setSTwitters] = useState([]);
  useEffect(() => {
    dbService
      .collection("simple-twitter")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const stwitterArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSTwitters(stwitterArray);
      });
  }, []);

  return (
    <>
      <STwitterFactory userObj={userObj} />
      <div>
        {stwitters.map((sTwitter) => (
          <STwitter
            key={sTwitter.id}
            sTwitterObj={sTwitter}
            isOwner={sTwitter.creatorID === userObj.uid}
          />
        ))}
      </div>
    </>
  );
}

export default Home;

import React, { useState, useRef, useCallback, useEffect } from "react";
import { signOut } from "firebase/auth";
import { AppShell, Button, Group, Header, Modal, Stack } from "@mantine/core";
import { auth, db } from "../../firebase";
import UserInfo from "./UserInfo";
import Select from "react-select";
import { NumberInput } from "@mantine/core";
import { useReward } from "react-rewards";
import ReactCanvasConfetti from "react-canvas-confetti";

import restApis from "../../tools/githubRestApis";
import { doc, getDoc } from "firebase/firestore";
import { useSetState } from "@mantine/hooks";
// NOTE datastoreができるまでのダミーデータ
const dummyData = {
  token: "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",
  name: "yashiro-ryo",
  repo: "github-grass-grow",
};

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
};

function getAnimationSettings(angle, originX) {
  return {
    particleCount: 3,
    angle,
    spread: 55,
    origin: { x: originX },
    colors: ["#bb0000", "#ffffff"],
  };
}

const LogedIn = ({ token, user, setToken }) => {
  const [userInfo, setUserInfo] = useSetState({
    name: "",
    path: "",
    repo: "",
    token: "",
    weight: 0,
  });
  const [mets, setMets] = useSetState({});
  const [opened, setOpened] = useState(false);

  const { reward: rewardfun1, isAnimating1 } = useReward(
    "rewardId1",
    "confetti",
    {
      colors: ["#ACE7AE", "#69C16E", "#549F57", "#386C3E"],
      elementCount: 200,
    }
  );
  const { reward: rewardfun2, isAnimating2 } = useReward(
    "rewardId2",
    "confetti",
    {
      colors: ["#ACE7AE", "#69C16E", "#549F57", "#386C3E"],
    }
  );
  const { reward: rewardfun3, isAnimating3 } = useReward(
    "rewardId3",
    "confetti",
    {
      colors: ["#ACE7AE", "#69C16E", "#549F57", "#386C3E"],
    }
  );
  const { reward: rewardfun4, isAnimating4 } = useReward(
    "rewardId4",
    "confetti",
    {
      colors: ["#ACE7AE", "#69C16E", "#549F57", "#386C3E"],
    }
  );
  const { reward: rewardfun5, isAnimating5 } = useReward(
    "rewardId5",
    "confetti",
    {
      colors: ["#ACE7AE", "#69C16E", "#549F57", "#386C3E"],
    }
  );
  const { reward: rewardfun6, isAnimating6 } = useReward(
    "rewardId6",
    "confetti",
    {
      colors: ["#ACE7AE", "#69C16E", "#549F57", "#386C3E"],
    }
  );

  const options = [
    { value: "ストレッチング2.3メッツ", label: "ストレッチング2.3メッツ" },
    {
      value: "バレーボール、ボウリング3メッツ",
      label: "バレーボール、ボウリング3メッツ",
    },
    {
      value: "サーフィン、ソフトボール5メッツ",
      label: "Vサーフィン、ソフトボール5メッツ",
    },
  ];

  const refAnimationInstance = useRef(null);
  const [intervalId, setIntervalId] = useState();

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(60, 0));
      refAnimationInstance.current(getAnimationSettings(120, 1));
    }
  }, []);

  const startAnimation = useCallback(() => {
    if (!intervalId) {
      setIntervalId(setInterval(nextTickAnimation, 16));
    }
  }, [nextTickAnimation, intervalId]);

  const pauseAnimation = useCallback(() => {
    clearInterval(intervalId);
    setIntervalId(null);
  }, [intervalId]);

  const stopAnimation = useCallback(() => {
    clearInterval(intervalId);
    setIntervalId(null);
    refAnimationInstance.current && refAnimationInstance.current.reset();
  }, [intervalId]);
  const check = async () => {
    const docRef = doc(db, "users", user.uid);
    await getDoc(docRef)
      .then((data) => {
        data.exists() ? setUserInfo(data.data()) : setOpened(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    check();
    console.log(userInfo);
    // console.log(userInfo.weight);
  }, [opened]);

  const handleGrowGrass = () => {
    console.log("called methods");
    restApis
      .growGrassToGithub(dummyData.token, dummyData.name, dummyData.repo)
      .then(() => {
        console.log("草生やしたったwwwwww");
      });

    restApis.growGrassToGithub(dummyData.token, dummyData.name, dummyData.repo);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <>
      {true ? (
        <>
          <AppShell
            padding="md"
            header={
              <Header height={60} p="xs">
                <>
                  <Group position="apart">
                    {/* <Text>{user.displayName}</Text> */}
                    <Button
                      onClick={() => {
                        signOut(auth).then((result) => {
                          console.log(result);
                          setToken("");
                        });
                      }}
                    >
                      Logout
                    </Button>
                  </Group>
                </>
              </Header>
            }
          >
            <>
              <Modal onClose={() => setOpened(false)} opened={opened}>
                <UserInfo
                  setUserInfo={setUserInfo}
                  userInfo={userInfo}
                  token={token}
                  user={user}
                  setOpened={setOpened}
                />
              </Modal>
              <Stack align="center">
                <div>wwwwwwwwwwwwwwwwwwwww</div>
                <Select options={options} className="w-96" />
                <div>{userInfo.weight}</div>
                <NumberInput
                  className="w-fit"
                  value={userInfo.weight}
                  onChange={(val) => {
                    setUserInfo({ weight: val });
                  }}
                  placeholder="体重を入力してください"
                  // label="体重を入力してください"
                  withAsterisk
                />
                <div>時間</div>
                <div className="flex items-center">
                  <NumberInput
                    className="w-20"
                    defaultValue={50}
                    withAsterisk
                  />
                  <span className="text-xl">分</span>
                </div>
                <Button
                  disabled={isAnimating1}
                  onClick={() => {
                    rewardfun1();
                    rewardfun2();
                    rewardfun3();
                    rewardfun4();
                    rewardfun5();
                    rewardfun6();
                    startAnimation();
                    setTimeout(pauseAnimation, 2000);
                  }}
                  radius="md"
                >
                  送信
                </Button>
              </Stack>

              <div className="flex flex-col">
                <span id="rewardId1" className="bg-orange-500 w-fit">
                  wwwwww
                </span>
                <span
                  id="rewardId2"
                  className="bg-orange-500 w-fit absolute right-11"
                >
                  wwwwww
                </span>
                <span id="rewardId3" className="bg-orange-500 w-fit">
                  wwwwww
                </span>
                <span
                  id="rewardId4"
                  className="bg-orange-500 w-fit absolute top-72 right-60"
                >
                  wwwwww
                </span>
                <span id="rewardId5" className="bg-orange-500 w-fit">
                  wwwwww
                </span>
                <span
                  id="rewardId6"
                  className="bg-orange-500 w-fit absolute bottom-44 right-11"
                >
                  wwwwww
                </span>
              </div>
              <div>
                <button onClick={startAnimation}>Start</button>
                <button onClick={pauseAnimation}>Pause</button>
                <button onClick={stopAnimation}>Stop</button>
              </div>
              <Button
                onClick={() => {
                  setOpened(true);
                }}
              >
                modal
              </Button>
              <ReactCanvasConfetti
                refConfetti={getInstance}
                style={canvasStyles}
              />
            </>
          </AppShell>
        </>
      ) : (
        <>
          <UserInfo setUserInfo={setUserInfo} token={token} user={user} />
        </>
      )}
    </>
  );
};

export default LogedIn;

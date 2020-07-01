/*
 * Tezos-monsters - play game to lean Ligo and Tezos
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Media } from "react-bootstrap";
import { QuizPage } from "../../containers/StoryPages/QuizPage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import actions from "../../store/actions";
import { CodePage } from "../../containers/StoryPages/CodePage";
import { Answer } from "../../core/answer";
import { ThroughFade } from "../../components/ThroughFadeEffect/ThroughFade";
import {
  SkeletonMessage,
  SkeletonModal,
} from "../../containers/StoryPages/SkeletonModal";
import { PicturePage } from "../../containers/StoryPages/PicturePage";
import AppBar from "../../components/AppBar/AppBar";
import { TextPage } from "../../containers/StoryPages/TextPage";
import { STATUS } from "../../store/utils/status";
import { MonsterFactory } from "../../containers/MonsterFactory/MonsterFactory";
import {Helmet} from "react-helmet";

export const StoryScreen: React.FC = () => {
  const dispatch = useDispatch();

  const [skeletonMessage, setSkeletonMessage] = useState<
    SkeletonMessage | undefined
  >(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [showModalButton, setShowModalButton] = useState(false);

  useEffect(() => {
    dispatch(actions.game.getCurrentPage());
  }, []);

  const [hash, setHash] = useState("0");

  const data = useSelector((state: RootState) => state.game.storyPage);

  const operationStatus = useSelector(
    (state: RootState) => state.operations.data[hash]?.data?.status
  );

  const review = useSelector((state: RootState) => state.game.response);
  const { isStepSolved } = useSelector((state: RootState) => state.profile);

  // TODO: Move status to new Dataloader component

  useEffect(() => {
    if (hash !== "0") {
      switch (operationStatus) {
        case STATUS.SUCCESS:
          setHash("0");
          if (data?.isCodePage) {
            setSkeletonMessage({
              header: review?.error ? "Found some errors!" : "Great Job",
              text: review?.error
                ? "Check errors in code review window under editor"
                : "Press Next button in top right corner to go further!",
              buttonText: review?.error ? "Try again" : "Next",
            });
          }
          setShowModalButton(true);
          break;

        case STATUS.FAILURE:
          setHash("0");
          setModalVisible(false);
          alert("Cant submit your operation to server");
      }
    }
  }, [hash, operationStatus]);

  const onAnswerClicked = (answer: Answer) => {
    setSkeletonMessage({
      header: answer.isCorrect ? "Great job!" : "You are wrong!",
      text: answer.message,
      buttonText: "Next",
    });

    if (answer !== undefined && answer.isCorrect) {
      const newHash = Date.now().toString();
      dispatch(actions.game.checkQuizAnswer(answer.id, newHash));
      setShowModalButton(false);
      setHash(newHash);
    } else {
      setShowModalButton(true);
    }
    setModalVisible(true);
  };

  const submitCode = (code: string) => {
    setSkeletonMessage({
      header: "Checking your code",
      text: "Relax, we review your code!",
    });
    setShowModalButton(false);
    const newHash = Date.now().toString();
    dispatch(actions.game.checkCodeAnswer(code, newHash));
    setHash(newHash);
    setModalVisible(true);
  };

  const onModalClosed = () => {
    setModalVisible(false);
    setShowModalButton(false);
  };

  const leftPage =
    data === undefined ? (
      "Loading"
    ) : data.isCodePage ? (
      <TextPage data={data} />
    ) : (
      <PicturePage data={data} />
    );

  const rightPage =
    data === undefined ? (
      "Loading"
    ) : data.isCodePage ? (
      <CodePage data={data} onCheckCode={submitCode} done={isStepSolved} />
    ) : (
      <QuizPage data={data} onAnswerClicked={onAnswerClicked} />
    );

  const twoPages = data === undefined ? (
      "Loading"
  ) : data.isMonsterPage ? (
    <MonsterFactory data={data} onAnswerClicked={onAnswerClicked}/>
  ) : (
    <Container
      fluid
      style={{
        backgroundColor: "#000",
        overflow: "hidden",
        height: "100vh",
        opacity: modalVisible ? 0.1 : 1,
      }}
    >
      <Row>
        <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{ padding: 0 }}>
          {leftPage}
        </Col>
        <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{ padding: 0, overflowY: 'scroll' }}>
          {rightPage}
        </Col>
      </Row>
    </Container>
  );

  return (
    <ThroughFade>
      <Helmet title={`${data?.header || ""} - Tezos Monsters` } />
      <SkeletonModal
        message={skeletonMessage}
        onPress={onModalClosed}
        visible={modalVisible}
        showButton={showModalButton}
      />
      <AppBar />
      {twoPages}
    </ThroughFade>
  );
};

import React, { useState, useEffect } from "react";
import jwtAxios from "../../util/jwtUtil";
import { Modal, Button, Form, Input, Select } from "antd";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export const CreateProjectModal = ({ setIsCreateProjectModalOpen, member }) => {
  const [problemList, setProblemList] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    jwtAxios
      .get(`${process.env.REACT_APP_API_SERVER_HOST}/problems`)
      .then((response) => {
        // console.log(response.data);
        setProblemList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const showModal = () => {
    setIsCreateProjectModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateProjectModalOpen(false);
  };

  const onChange = (value) => {
    console.log("Test Selected : ", value);
  };

  const onSubmit = (value) => {
    console.log("New project : ", value.project);

    jwtAxios
      .post(`${process.env.REACT_APP_API_SERVER_HOST}/projects`, {
        name: value.project.name,
        problemId: value.project.problemId,
        memberId: member.memberId,
      })
      .then((response) => {
        console.log(response);
        if (response.status == 201) {
          setProjectId(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setIsCreateProjectModalOpen(false);
  };

  return (
    <Modal
      title="Create Live Coding Test"
      open={showModal}
      onCancel={closeModal}
      footer={null} // footer를 비워서 기본 버튼이 사라지게 함
    >
      <Form
        {...layout}
        name="create-project"
        onFinish={onSubmit}
        style={{
          marginRight: 40,
          maxWidth: 600,
        }}
      >
        <Form.Item
          name={["project", "name"]}
          label="Project Name"
          style={{
            marginTop: 50,
          }}
          rules={[
            {
              required: true,
              message: "프로젝트 이름을 입력해주세요",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["project", "problemId"]}
          label="Select a Test"
          style={{
            marginTop: 30,
          }}
          rules={[
            {
              required: true,
              message: "목록에서 문제를 선택해주세요",
            },
          ]}
        >
          <Select
            // showSearch
            placeholder="Select a Test from The List"
            optionFilterProp="children"
            onChange={onChange}
            // onSearch={onSearch}
            // filterOption={filterOption}
            options={problemList.map((problem) => ({
              key: problem.id,
              value: problem.id,
              label: problem.title,
            }))}
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
            span: 16,
          }}
        >
          <div className="flex gap-10 mt-5">
            <Button className="bg-[#1880ff]" type="primary" htmlType="submit">
              Create
            </Button>
            <Button type="default" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

import React, { useState } from "react";
import { Form, Input, Button, message, Spin, Cascader } from "antd";
import { PlusOutlined, FolderOutlined } from "@ant-design/icons";
import { createCategory } from "../services/apiService";

const CreateCategory = ({ categories, loadCategories }) => {
  const [name, setName] = useState("");
  const [parent, setParent] = useState(null);
  const [selectedPath, setSelectedPath] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      message.warning("Category name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      await createCategory({ name, parent: parent === "null" ? null : parent });
      message.success("Category added successfully.");
      setName("");
      setParent(null);
      setSelectedPath([]);
      loadCategories();
    } catch (error) {
      if (error.response?.status === 403) {
        message.error(
          "Unauthorized access! You do not have permission to perform this action."
        );
      } else {
        message.error(error.response?.data?.error || "Failed to add category.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Transform categories for cascader
  const transformCategoriesToCascader = (categories) => {
    return categories.map((cat) => ({
      value: cat._id,
      label: cat.name,
      children:
        cat.children && cat.children.length > 0
          ? transformCategoriesToCascader(cat.children)
          : undefined,
    }));
  };

  const cascaderOptions = [
    {
      value: "null",
      label: "Parent",
    },
    ...transformCategoriesToCascader(categories),
  ];

  // Handle cascader change
  const handleCascaderChange = (value, selectedOptions) => {
    setParent(value ? value[value.length - 1] : null);
    setSelectedPath(selectedOptions?.map((option) => option.label));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <FolderOutlined className="text-blue-500 text-xl" />
        <h2 className="text-xl font-semibold text-gray-800 m-0">
          Create New Category
        </h2>
      </div>

      <Form onFinish={handleSubmit} layout="vertical" className="space-y-4">
        <Form.Item
          label={
            <span className="text-gray-700 font-medium">Category Name</span>
          }
          required
          className="mb-4"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            disabled={loading}
            prefix={<PlusOutlined className="text-gray-400" />}
            className="h-10"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-gray-700 font-medium">Parent Category</span>
          }
          className="mb-2"
        >
          <Cascader
            options={cascaderOptions}
            onChange={handleCascaderChange}
            placeholder="Select parent category"
            disabled={loading}
            className="w-full"
            expandTrigger="hover"
            changeOnSelect
            showSearch={{
              filter: (inputValue, path) => {
                return path.some(
                  (option) =>
                    option.label
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase()) > -1
                );
              },
            }}
          />
        </Form.Item>

        {/* Category Path Display */}
        {selectedPath.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-1">
              Selected Category Path:
            </p>
            <div className="flex items-center flex-wrap gap-2">
              {selectedPath.map((path, index) => (
                <React.Fragment key={index}>
                  <span className="text-blue-600 font-medium">{path}</span>
                  {index < selectedPath.length - 1 && (
                    <span className="text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            {name && (
              <div className="mt-2 text-sm text-gray-500">
                New category "{name}" will be created under:{" "}
                {selectedPath[selectedPath.length - 1]}
              </div>
            )}
          </div>
        )}

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            className="w-full h-10 flex items-center justify-center"
            icon={loading ? null : <PlusOutlined />}
          >
            {loading ? <Spin size="small" /> : "Add Category"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCategory;

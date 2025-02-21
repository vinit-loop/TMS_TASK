import {
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { Button, Empty, Input, Modal, Select, Tabs, Tree, message } from "antd";
import React, { useState } from "react";
import { deleteCategory, updateCategory } from "../services/apiService";

const { TabPane } = Tabs;
const { Option } = Select;

const CategoryTree = ({ categories, loadCategories }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [newName, setNewName] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = async () => {
    if (!newName.trim()) {
      message.warning("Category name cannot be empty.");
      return;
    }

    try {
      await updateCategory(editingCategory, {
        name: newName,
        status: newStatus,
      });
      message.success("Category updated successfully.");
      setModalVisible(false);
      setEditingCategory(null);
      setNewName("");
      loadCategories();
    } catch (error) {
      console.error("Update Error:", error);

      const errorMessage =
        error.response?.data?.error ||
        "Error updating category. Please try again.";

      Modal.error({
        title: "Update Failed",
        content: errorMessage,
      });
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content:
        "This will delete the category and all its subcategories permanently.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success("Category deleted successfully.");
          loadCategories();
        } catch (error) {
          console.error("Delete Error:", error);
          message.error(
            error.response?.data?.error || "Error deleting category."
          );
        }
      },
    });
  };

  const renderTreeView = () => (
    <div className="mt-4">
      {categories.length === 0 ? (
        <Empty description="No categories found." />
      ) : (
        <Tree
          className="bg-white rounded-lg p-4 shadow-sm"
          treeData={categories}
          defaultExpandAll
          titleRender={(node) => (
            <div className="flex items-center justify-between py-1 w-full group">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{node.name}</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    node.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {node.status}
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button.Group>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingCategory(node._id);
                      setNewName(node.name);
                      setNewStatus(node.status);
                      setModalVisible(true);
                    }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(node._id)}
                  />
                </Button.Group>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );

  const renderDecisionNode = (node, level = 0) => {
    const nodeColors = {
      active: "bg-blue-100 border-blue-200",
      inactive: "bg-gray-100 border-gray-200",
    };

    return (
      <div key={node._id} className="relative ">
        <div
          className={`flex flex-col items-center ms-5 ${
            level > 0 ? "mt-8" : "mt-4"
          }`}
        >
          {level > 0 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-300 -mt-8" />
          )}

          <div
            className={`relative group p-4 rounded-lg border-2 ${
              nodeColors[node.status]
            } min-w-[200px]`}
          >
            <div className="text-center">
              <div className="font-medium">{node.name}</div>
              <div className="text-sm text-gray-500">Status: {node.status}</div>
            </div>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button.Group size="small">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingCategory(node._id);
                    setNewName(node.name);
                    setNewStatus(node.status);
                    setModalVisible(true);
                  }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(node._id)}
                />
              </Button.Group>
            </div>
          </div>

          {/* Children nodes */}
          {node.children && node.children.length > 0 && (
            <div className="relative mt-8 flex justify-center gap-8">
              {/* Horizontal line to children */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-300 -mt-8" />

              {/* Horizontal line connecting children */}
              {node.children.length > 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gray-300 -mt-8" />
              )}

              {/* Render children */}
              {node.children.map((child) =>
                renderDecisionNode(child, level + 1)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDropdownView = () => (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-sm overflow-x-auto">
      {categories.length === 0 ? (
        <Empty description="No categories found." />
      ) : (
        <div className="min-w-full flex justify-center">
          {categories.map((category) => renderDecisionNode(category))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>
      </div>

      <Tabs defaultActiveKey="tree" className="w-full">
        <TabPane
          tab={
            <span className="flex items-center space-x-2">
              <FolderOutlined />
              <span>Tree View</span>
            </span>
          }
          key="tree"
        >
          {renderTreeView()}
        </TabPane>
        <TabPane
          tab={
            <span className="flex items-center space-x-2">
              <UnorderedListOutlined />
              <span>Decision Tree View</span>
            </span>
          }
          key="dropdown"
        >
          {renderDropdownView()}
        </TabPane>
      </Tabs>

      <Modal
        title="Edit Category"
        open={modalVisible}
        onOk={handleEdit}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
        }}
      >
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={newStatus}
              onChange={setNewStatus}
              className="w-full"
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryTree;

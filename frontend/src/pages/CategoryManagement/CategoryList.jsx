import { Col, Divider, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import CategoryTree from "../../components/CategoryTree";
import CreateCategory from "../../components/CreateCategory";
import { fetchCategories } from "../../services/apiService";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetchCategories();
      setCategories(response?.data || []);
    } catch (error) {
      message.error("Error fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Row
          gutter={[24, 24]}
          justify="space-between"
          className="items-stretch"
        >
          {/* Create Category Section */}
          <Col
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
            className="flex justify-center"
          >
            <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
              <CreateCategory
                categories={categories}
                loadCategories={loadCategories}
              />
            </div>
          </Col>

          {/* Vertical Divider for md and larger screens */}
          <Col className="hidden md:block" md={2} lg={2} xl={2}>
            <div className="h-full flex justify-center items-center">
              <Divider type="vertical" className="h-full bg-gray-300" />
            </div>
          </Col>

          {/* Horizontal Divider for small screens */}
          <Col xs={24} sm={24} className="md:hidden">
            <Divider className="bg-gray-300 my-2" />
          </Col>

          {/* Category Tree Section */}
          <Col
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
            className="flex justify-center"
          >
            <div className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
              <CategoryTree
                categories={categories}
                loadCategories={loadCategories}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CategoryList;

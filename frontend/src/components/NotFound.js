import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Result
        status="404"
        title="404"
        subTitle={
          <div className="space-y-2">
            <p className="text-gray-600">
              Sorry, the page you visited does not exist.
            </p>
            <p className="text-gray-500 text-sm">
              The page might have been removed, renamed, or is temporarily
              unavailable.
            </p>
          </div>
        }
        extra={
          <div className="space-x-4">
            <Button
              type="primary"
              onClick={() => navigate("/category/list")}
              className="hover:opacity-90"
            >
              Back Home
            </Button>
            <Button onClick={() => navigate(-1)} className="hover:opacity-90">
              Go Back
            </Button>
          </div>
        }
        className="bg-white p-8 rounded-lg shadow-sm"
      />
    </div>
  );
};

export default NotFound;

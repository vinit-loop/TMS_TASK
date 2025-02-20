import Category from "../modals/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const category = new Category({ name, parent: parent || null });
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const buildTree = (parentId = null) => {
      return categories
        .filter((cat) => String(cat.parent) === String(parentId))
        .map((cat) => ({
          ...cat,
          children: buildTree(cat._id),
        }));
    };

    res.json(buildTree());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, status } = req.body;
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (status === "active" && category.parent) {
      const parentCategory = await Category.findById(category.parent);
      if (parentCategory && parentCategory.status === "inactive") {
        return res.status(400).json({
          error: "Cannot activate a category if its parent is inactive.",
        });
      }
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, status },
      { new: true }
    );

    // If setting category to inactive, set all child categories to inactive
    if (status === "inactive") {
      await Category.updateMany({ parent: categoryId }, { status: "inactive" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await deleteSubcategories(category._id);

    await category.deleteOne();

    res
      .status(200)
      .json({ message: "Category and all its subcategories deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSubcategories = async (parentId) => {
  const subcategories = await Category.find({ parent: parentId });

  for (const subcategory of subcategories) {
    await deleteSubcategories(subcategory._id);
    await subcategory.deleteOne();
  }
};

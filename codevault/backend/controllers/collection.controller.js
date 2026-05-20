import Collection from "../models/collection.model.js";
import Snippet from "../models/snippet.model.js";

async function findOwnedCollection(collectionId, userId) {
  return Collection.findOne({ _id: collectionId, user: userId });
}

export async function getCollections(req, res, next) {
  try {
    const collections = await Collection.find({ user: req.user._id }).sort({
      name: 1,
    });

    res.json(collections);
  } catch (error) {
    next(error);
  }
}

export async function createCollection(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      res.status(400);
      throw new Error("Collection name is required");
    }

    const collection = await Collection.create({
      user: req.user._id,
      name,
      description,
    });

    res.status(201).json(collection);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error("Collection already exists"));
      return;
    }

    next(error);
  }
}

export async function updateCollection(req, res, next) {
  try {
    const collection = await findOwnedCollection(req.params.id, req.user._id);

    if (!collection) {
      res.status(404);
      throw new Error("Collection not found");
    }

    const { name, description } = req.body;

    if (name !== undefined && !name.trim()) {
      res.status(400);
      if (name !== undefined) collection.name = name;
      throw new Error("Collection name is required");
    }
    if (description !== undefined) collection.description = description;

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error("Collection already exists"));
      return;
    }

    next(error);
  }
}

export async function deleteCollection(req, res, next) {
  try {
    const collection = await findOwnedCollection(req.params.id, req.user._id);

    if (!collection) {
      res.status(404);
      throw new Error("Collection not found");
    }

    await Snippet.updateMany(
      { user: req.user._id, snippetCollection: collection._id },
      { $unset: { snippetCollection: "" } },
    );
    await collection.deleteOne();

    res.json({ message: "Collection deleted" });
  } catch (error) {
    next(error);
  }
}

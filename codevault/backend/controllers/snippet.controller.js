import Snippet from "../models/snippet.model.js";
import Collection from "../models/collection.model.js";

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.map((tag) => String(tag).trim()).filter(Boolean);
}

async function findOwnedSnippet(snippetId, userId) {
  return Snippet.findOne({ _id: snippetId, user: userId });
}

export async function getSnippets(req, res, next) {
  try {
    const snippets = await Snippet.find({ user: req.user._id })
      .populate("collection", "name description")
      .sort({
        updatedAt: -1,
      });

    res.json(snippets);
  } catch (error) {
    next(error);
  }
}

export async function getSnippet(req, res, next) {
  try {
    const snippet = await findOwnedSnippet(req.params.id, req.user._id).populate(
      "collection",
      "name description",
    );

    if (!snippet) {
      res.status(404);
      throw new Error("Snippet not found");
    }

    res.json(snippet);
  } catch (error) {
    next(error);
  }
}

export async function createSnippet(req, res, next) {
  try {
    const { title, collection, description, language, tags, favorite, code } =
      req.body;

    if (!title || !language || !code) {
      res.status(400);
      throw new Error("Title, language, and code are required");
    }

    if (collection) {
      const ownedCollection = await Collection.exists({
        _id: collection,
        user: req.user._id,
      });

      if (!ownedCollection) {
        res.status(400);
        throw new Error("Collection not found");
      }
    }

    const snippet = await Snippet.create({
      user: req.user._id,
      collection: collection || null,
      title,
      description,
      language,
      tags: normalizeTags(tags),
      favorite: Boolean(favorite),
      code,
    });

    const populatedSnippet = await snippet.populate(
      "collection",
      "name description",
    );
    res.status(201).json(populatedSnippet);
  } catch (error) {
    next(error);
  }
}

export async function updateSnippet(req, res, next) {
  try {
    const snippet = await findOwnedSnippet(req.params.id, req.user._id);

    if (!snippet) {
      res.status(404);
      throw new Error("Snippet not found");
    }

    const { title, collection, description, language, tags, favorite, code } =
      req.body;

    if (title !== undefined) snippet.title = title;
    if (collection !== undefined) {
      if (collection) {
        const ownedCollection = await Collection.exists({
          _id: collection,
          user: req.user._id,
        });

        if (!ownedCollection) {
          res.status(400);
          throw new Error("Collection not found");
        }
      }

      snippet.collection = collection || null;
    }
    if (description !== undefined) snippet.description = description;
    if (language !== undefined) snippet.language = language;
    if (tags !== undefined) snippet.tags = normalizeTags(tags);
    if (favorite !== undefined) snippet.favorite = Boolean(favorite);
    if (code !== undefined) snippet.code = code;

    const updatedSnippet = await snippet.save();
    await updatedSnippet.populate("collection", "name description");
    res.json(updatedSnippet);
  } catch (error) {
    next(error);
  }
}

export async function deleteSnippet(req, res, next) {
  try {
    const snippet = await findOwnedSnippet(req.params.id, req.user._id);

    if (!snippet) {
      res.status(404);
      throw new Error("Snippet not found");
    }

    await snippet.deleteOne();
    res.json({ message: "Snippet deleted" });
  } catch (error) {
    next(error);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const snippet = await findOwnedSnippet(req.params.id, req.user._id);

    if (!snippet) {
      res.status(404);
      throw new Error("Snippet not found");
    }

    snippet.favorite = !snippet.favorite;
    const updatedSnippet = await snippet.save();
    await updatedSnippet.populate("collection", "name description");

    res.json(updatedSnippet);
  } catch (error) {
    next(error);
  }
}

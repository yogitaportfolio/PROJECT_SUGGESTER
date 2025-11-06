const Project = require('../models/Project');

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = new Project({ user: req.user.id, title, description });
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.addSuggestion = async (req, res) => {
  try {
    const { projectId, suggestion } = req.body;
    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.suggestions = project.suggestions || [];
    project.suggestions.push(suggestion);
    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
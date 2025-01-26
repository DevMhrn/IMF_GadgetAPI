// backend/controllers/gadgets.controller.js
import db from '../models/index.js';
import logger from '../utils/logger.js';
import generateCodename from '../services/codenames.js';

// Function to generate a random success probability
function generateMissionSuccessProbability() {
  return Math.floor(Math.random() * 101) + '%';
}

// GET all gadgets
export const getAllGadgets = async (req, res, next) => {
  try {
    logger.debug('Fetching gadgets with filters:', req.query);
    const status = req.query.status;
    let whereClause = {};
    if (status) {
      whereClause.status = status;
    }
    
    // Add user filter based on role
    
    if (req.user.role !== 'ADMIN') {
      whereClause.UserId = req.user.id;
    }
    
    const gadgets = await db.Gadget.findAll({
      where: whereClause,
      include: [{
        model: db.User,
        attributes: ['email', 'role'] // Only include necessary user fields
      }]
    });
    logger.info(`Retrieved ${gadgets.length} gadgets for user ${req.user.email}`);
    
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget.toJSON(),
      missionSuccessProbability: generateMissionSuccessProbability(),
    }));
    
    res.json(gadgetsWithProbability);
  } catch (error) {
    logger.error('Error fetching gadgets:', error);
    next(error);
  }
};

// POST a new gadget
export const createGadget = async (req, res) => {
  try {
    const newGadget = await db.Gadget.create({
      ...req.body,
      name: generateCodename(),
      UserId: req.user.id // Associate gadget with current user
    });
    res.status(201).json(newGadget);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// PATCH to update a gadget
export const updateGadget = async (req, res) => {
  try {
    const gadget = await db.Gadget.findOne({
      where: {
        id: req.params.id,
        ...(req.user.role !== 'ADMIN' ? { UserId: req.user.id } : {})
      }
    });
    
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found or unauthorized' });
    }

    if (gadget.status === 'Destroyed') {
      return res.status(400).json({ message: 'Cannot update a destroyed gadget' });
    }

    await gadget.update(req.body);
    res.json({ 
      ...gadget.toJSON(),
      message: `Gadget ${gadget.name} has been updated successfully`
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE (decommission) a gadget
export const deleteGadget = async (req, res) => {
  try {
    const gadget = await db.Gadget.findOne({
      where: {
        id: req.params.id,
        ...(req.user.role !== 'ADMIN' ? { UserId: req.user.id } : {})
      }
    });
    
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found or unauthorized' });
    }

    if (gadget.status === 'Destroyed') {
      return res.status(400).json({ message: 'Gadget is already destroyed' });
    }

    if (gadget.status === 'Decommissioned') {
      return res.status(400).json({ message: 'Gadget is already decommissioned' });
    }

    await gadget.update({ status: 'Decommissioned', decommissionedAt: new Date() });
    res.json({
      ...gadget.toJSON(),
      message: `Gadget ${gadget.name} has been decommissioned`
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST to trigger self-destruct sequence
export const selfDestruct = async (req, res, next) => {
  try {
    logger.warn(`Self-destruct initiated for gadget ID: ${req.params.id}`);
    const gadget = await db.Gadget.findOne({
      where: {
        id: req.params.id,
        ...(req.user.role !== 'ADMIN' ? { UserId: req.user.id } : {})
      }
    });
    
    if (!gadget) {
      return res.status(404).json({ message: 'Gadget not found or unauthorized' });
    }

    if (gadget.status === 'Destroyed') {
      return res.status(400).json({ message: 'Gadget is already destroyed' });
    }

    await gadget.update({ status: 'Destroyed' });
    logger.warn(`Gadget ${gadget.name} has been destroyed`);

    res.json({ 
      ...gadget.toJSON(),
      message: `Self-destruct sequence completed for ${gadget.name}`
    });
  } catch (error) {
    logger.error('Self-destruct sequence failed:', error);
    next(error);
  }
};

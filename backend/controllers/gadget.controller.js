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
    
    const gadgets = await db.Gadget.findAll({ where: whereClause });
    logger.info(`Retrieved ${gadgets.length} gadgets`);
    
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
    });
    res.status(201).json(newGadget);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// PATCH to update a gadget
export const updateGadget = async (req, res) => {
  try {
    const gadget = await db.Gadget.findByPk(req.params.id);
    if (!gadget) {
      return res.status(404).send('Gadget not found');
    }
    await gadget.update(req.body);
    res.json(gadget);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// DELETE (decommission) a gadget
export const deleteGadget = async (req, res) => {
  try {
    
    const gadget = await db.Gadget.findByPk(req.params.id);
    if (!gadget) {
      return res.status(404).send('Gadget not found');
    }

    await gadget.update({ status: 'Decommissioned', decommissionedAt: new Date() });
    res.status(201).send({

        message: `Gadget ${gadget.name} has been decommissioned`

    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// POST to trigger self-destruct sequence
export const selfDestruct = async (req, res, next) => {
  try {
    logger.warn(`Self-destruct initiated for gadget ID: ${req.params.id}`);
    const gadget = await db.Gadget.findByPk(req.params.id);
    
    if (!gadget) {
      logger.error(`Gadget not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Gadget not found' });
    }

    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
    logger.info(`Generated confirmation code for ${gadget.name}: ${confirmationCode}`);

    await gadget.update({ status: 'Destroyed' });
    logger.warn(`Gadget ${gadget.name} has been destroyed`);

    res.json({ 
      message: `Self-destruct sequence completed for ${gadget.name}`,
      confirmationCode 
    });
  } catch (error) {
    logger.error('Self-destruct sequence failed:', error);
    next(error);
  }
};

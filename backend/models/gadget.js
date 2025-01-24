// backend/models/gadget.js
import { v4 as uuidv4 } from 'uuid';

const defineGadget = (sequelize, DataTypes) => {
  const Gadget = sequelize.define('Gadget', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Available', 'Deployed', 'Destroyed', 'Decommissioned'),
      defaultValue: 'Available',
    },
    decommissionedAt: {
      type: DataTypes.DATE,
    },
  });

  return Gadget;
};

export default defineGadget;
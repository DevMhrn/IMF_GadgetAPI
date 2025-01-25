import { v4 as uuidv4 } from 'uuid';

const defineUser = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    firebaseUid: {
      type: DataTypes.STRING(1200),  // Increased length
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'AGENT', 'HANDLER'),
      defaultValue: 'AGENT'
    },
    lastLogin: {
      type: DataTypes.DATE
    }
  });

  return User;
};

export default defineUser;


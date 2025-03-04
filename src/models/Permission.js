'use strict';

import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { isProductionEnvironment } from '../utilities/boolean';

const { Schema, model } = mongoose;
const autoIncrement = mongooseSequence(mongoose);

//PERMISSION SCHEMA
//  ============================================
const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    value: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

/**
 * Set the autoCreate option on models if not on production
 */
permissionSchema.set('autoCreate', !isProductionEnvironment());

/**
 * Increments permissionId everytime an instances is created
 */
permissionSchema.plugin(autoIncrement, { inc_field: 'permissionId' });

/**
 * Creates index in database for permissionId
 */
permissionSchema.index({ permissionId: 1 });

/**
 * Create Permission model out of permissionSchema
 */
const Permission = model('Permission', permissionSchema);

export default Permission;

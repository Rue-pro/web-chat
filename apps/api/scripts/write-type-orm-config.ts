import { typeormConfig } from '../src/database/config/typeorm.config';
import fs = require('fs');

const seedingConfig = {
  ...typeormConfig,
  seeds: ['src/database/seeds/initialSeed.ts'],
  factories: ['src/database/factories/**/*.ts'],
};

if (seedingConfig.entities && Array.isArray(seedingConfig.entities)) {
  seedingConfig.entities = seedingConfig.entities.map((entity) => {
    const entityPath = entity.toString();
    return 'src' + entityPath.slice(entityPath.indexOf('dist') + 4);
  });
}
fs.writeFileSync('ormconfig.json', JSON.stringify(seedingConfig, null, 2));

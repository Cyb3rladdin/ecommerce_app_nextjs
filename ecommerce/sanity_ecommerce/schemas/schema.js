import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';    //import schema types from any plugins that might expose them

import product from './product';
import banner from './banner';

// give schema to the builder and provide the result to Sanity
export default createSchema({
  name: 'default',
  //concatenate our document type to the ones provided by any plugins that are installed
  types: schemaTypes.concat([ product, banner ]),
})

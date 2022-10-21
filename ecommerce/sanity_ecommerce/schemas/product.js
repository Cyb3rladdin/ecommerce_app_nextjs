//all we need to do in a sanity app on the schema is export it and add the objects to be used
export default {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
        {
            name: 'image',
            title: 'Image',
            type: 'array',
            of: [{type: 'image' }],
            options: {
                hotspot: true,      //hotspot gives the UI the ability to crop the image in different areas of the app (visit sanity.io to find the meaning of an object)

            }
        },
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {   //slug is like a URL or a unique identifier
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 90,
            }
        },
        {
            name: 'price',
            title: 'Price',
            type: 'number'
        },
        {
            name: 'details',
            title: 'Details',
            type: 'string'
        }
        

    ]
}
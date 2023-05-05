const { MongoClient } = require('mongodb');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function main() {
  // URL de conexión de MongoDB
  const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    // Conectamos con la base de datos
    await client.connect();

    // Accedemos a la colección de conciertos
    const concertsCollection = client.db().collection('concerts');

    // Actualizamos el logo del concierto con título "Diego El Cigala Canta A México"
    const concertToUpdate = await concertsCollection.findOne({ title: 'Diego El Cigala Canta A México' });
    const publicId = `${concertToUpdate._id}-${new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-')}.jpg`;
    const uploadOptions = {
      public_id: `concerts/${publicId}`,
      format: 'jpg'
    };
    const { secure_url: publicUrl } = await cloudinary.uploader.upload('https://s3.us-east-1.amazonaws.com/pub.comar.p51-s3.secutix.com/images/catalog/product/large/cdafc79a-06c0-4053-a331-50fe6da9f070.jpg', uploadOptions);
    await concertsCollection.updateOne({ _id: concertToUpdate._id }, { $set: { logo: publicUrl, publicId } });
    console.log(`Logo for concert ${concertToUpdate.title} updated successfully`);

    // Actualizamos todos los logos de los conciertos
    const allConcerts = await concertsCollection.find().toArray();

    for (const concert of allConcerts) {
      const folder = `${concert.location
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s/g, '-')
      }/${concert.venue
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s/g, '-')
      }/${new Date().getFullYear()}/${
        concert.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, 'and')
        .replace(/\s+/g, '-')
      }`;    
      const publicId = `${concert._id}-${new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-')}.jpg`;
      const uploadOptions = {
        public_id: `${folder}/${new Date().getTime()}`,
        format: 'jpg'
      };
      try {
        const { secure_url: publicUrl } = await cloudinary.uploader.upload(concert.logo, uploadOptions);

        // Actualizamos el documento del concierto con el nuevo public ID
        await concertsCollection.updateOne({ _id: concert._id }, { $set: { logo: publicUrl, publicId } });

        console.log(`Concert ${concert.title} updated successfully`);
      } catch (error) {
        console.error(`Error updating concert ${concert.title} logo: ${error.message}`);
        continue;
      }
    }
    console.log('All logos updated successfully');
  } catch (error) {
    console.error(error);
  } finally {
    // Cerramos la conexión con la base de datos
    await client.close();
  }
}

main().catch(console.error);

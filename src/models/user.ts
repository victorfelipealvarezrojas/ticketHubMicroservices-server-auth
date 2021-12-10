import mongoose, { model } from 'mongoose';
import { Password } from '../services/password';



//defino la estructura que tendra el esquema del user
interface UserAttrs {
    email: string;
    password: string;
}
/*
   #####################################################################################################################################################
   ##mongoose funciona con la construccion de dos estructuras, model el cual me permite realizar el CRUD y document que me da acceso a un registro...###
   ##Aqui definire las interfaces para dichas estructuras o clases(UserModel,userDocument)##############################################################
   #####################################################################################################################################################
*/

//interface que define las propiedades que tiene un modelo de usuario
interface UserModel extends mongoose.Model<userDocument> {
    buildUser(attrs: UserAttrs): userDocument;
}

//interface que describe las propiedades que tendra un documrnto, es decir un registro de usuario
interface userDocument extends mongoose.Document {
    email: string;
    password: string;
}

//defino el esquema que tendra la entidad de usuario
const userShema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc,ret,){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;//elimino de ret(rep[resentacio]) las password (delete) elimina una propiedad de un objeto
            delete ret.__v;
        }
    }
});

//me aseguro de siempre guardar mi contraseña encriptada, utilizo function para mantener el contaxto de la instancia de ejecucion actual y no arrow function que usa instancia global
userShema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password')) //le entrego la contraseña que nacaba de establecerse en el document del usuario
        this.set('password', hashed);
    }
    done();
})

//agrego una nueva funcuin por medio del static al esquema de usuario al cual definire el typado
userShema.statics.buildUser = (attrs: UserAttrs) => {
    return new User(attrs);
};

//creo el modelo que es lo que me permitira acceder al conjunto de los datos, representa la coleccion de usuarios y me eprmite realizar (CRUD).
const User = mongoose.model<userDocument, UserModel>('User', userShema);

export { User };

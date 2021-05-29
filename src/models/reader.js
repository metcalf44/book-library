
module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            isEmail: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            len: [8, 16],
        },
    };

    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
}
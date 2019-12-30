export interface ResellerRegister {

    id?: number;
    id_address?: number;
    username?: string;
    email?: string;
    password?: string;


    recognition_name?: string;
    gender?: string;
    married?: string;
    phone?: string;
    cellphone?: string;
    website?: string;
    type?: string;
    name?: string;

    cnpj_cpf?: string;
    ie_rg?: string;
    birthday?: string;
    corporative_name?: string;

    first_holder?: string;
    first_holder_document?: string;

    second_holder?: string;
    second_holder_document?: string;

    fotoURL?: string;

    id_parent?: string;

    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipcode?: string;

    photo_profile?: string;

    foreign_type?: string;
    foreign_document_type?: string;
    foreign_document?: string;
    id_host?: string;
}

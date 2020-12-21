import apollo from "apollo-server";
const { gql } = apollo;

const PhotoType = gql`
  type Dates {
    isPublished: String
    updated: String
  }

  type Image {
    url: String
  }

  type PostContent {
    html: String
    text: String
  }

  type Photo {
    id: String
    title: String!
    image: Image
    description: String
    isPublic: Boolean
    user: User
    createdAt: Date
    views: Int
    likes: [User]
    isOwner: Boolean
  }

  type Query {
    photo(id: String): Photo
    photos(
      offset: Int
      limit: Int
      isPublic: Boolean
      isOwner: Boolean
    ): [Photo]!
  }

  type Mutation {
    createPhoto(photo: CreatePhotoInput): CommonResponse
    updatePhoto(photo: UpdatePhotoInput): CommonResponse
    deletePhoto(id: String!): CommonResponse
    deleteManyPhotos(posts: [String]): CommonResponse
  }

  input CreatePhotoInput {
    title: String!
    image: String
    description: String
    user: ID
    isPublic: Boolean
  }

  input UpdatePhotoInput {
    id: String
    title: String!
    image: String
    description: String
    user: ID
    isPublic: Boolean
  }

  enum MutationType {
    CREATED
    DELETED
    UPDATED
  }
`;

export default PhotoType;

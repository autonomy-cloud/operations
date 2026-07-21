import User from "./User";
import BaseModel from "./DatabaseBaseModel/DatabaseBaseModel";
import Route from "../../Types/API/Route";
import ColumnAccessControl from "../../Types/Database/AccessControl/ColumnAccessControl";
import TableAccessControl from "../../Types/Database/AccessControl/TableAccessControl";
import ColumnType from "../../Types/Database/ColumnType";
import CrudApiEndpoint from "../../Types/Database/CrudApiEndpoint";
import TableColumn from "../../Types/Database/TableColumn";
import TableColumnType from "../../Types/Database/TableColumnType";
import TableMetadata from "../../Types/Database/TableMetadata";
import IconProp from "../../Types/Icon/IconProp";
import ObjectID from "../../Types/ObjectID";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

/*
 * Durable OIDC identity link. Email is deliberately not part of the key: it is
 * mutable profile data and must never be used to merge security principals.
 */
@Index("IDX_UserOidcIdentity_issuer_subject", ["issuer", "subject"], {
  unique: true,
})
@TableAccessControl({ create: [], read: [], delete: [], update: [] })
@CrudApiEndpoint(new Route("/user-oidc-identity"))
@TableMetadata({
  tableName: "UserOidcIdentity",
  singularName: "User OIDC Identity",
  pluralName: "User OIDC Identities",
  icon: IconProp.Lock,
  tableDescription:
    "Immutable issuer and subject links between OIDC principals and Operations users.",
})
@Entity({ name: "UserOidcIdentity" })
export default class UserOidcIdentity extends BaseModel {
  @ColumnAccessControl({ create: [], read: [], update: [] })
  @TableColumn({
    manyToOneRelationColumn: "userId",
    type: TableColumnType.Entity,
    modelType: User,
    title: "User",
    description: "Operations user linked to this external principal.",
  })
  @ManyToOne(
    () => {
      return User;
    },
    { eager: false, nullable: false, onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "userId" })
  public user?: User = undefined;

  @ColumnAccessControl({ create: [], read: [], update: [] })
  @Index()
  @TableColumn({
    type: TableColumnType.ObjectID,
    required: true,
    title: "User ID",
    description: "Operations user linked to this external principal.",
  })
  @Column({
    type: ColumnType.ObjectID,
    nullable: false,
    transformer: ObjectID.getDatabaseTransformer(),
  })
  public userId?: ObjectID = undefined;

  @ColumnAccessControl({ create: [], read: [], update: [] })
  @TableColumn({
    type: TableColumnType.LongText,
    required: true,
    title: "Issuer",
    description: "Exact normalized iss claim from the validated ID token.",
  })
  @Column({ type: ColumnType.LongText, nullable: false })
  public issuer?: string = undefined;

  @ColumnAccessControl({ create: [], read: [], update: [] })
  @TableColumn({
    type: TableColumnType.LongText,
    required: true,
    title: "Subject",
    description: "Immutable sub claim from the validated ID token.",
  })
  @Column({ type: ColumnType.LongText, nullable: false })
  public subject?: string = undefined;

  @ColumnAccessControl({ create: [], read: [], update: [] })
  @TableColumn({
    type: TableColumnType.ShortText,
    required: true,
    title: "Provider Type",
    description: "The Operations OIDC flow that created this link.",
  })
  @Column({ type: ColumnType.ShortText, nullable: false })
  public providerType?: string = undefined;

  @ColumnAccessControl({ create: [], read: [], update: [] })
  @TableColumn({
    type: TableColumnType.ObjectID,
    required: false,
    title: "Provider ID",
    description: "Project or global OIDC configuration that created the link.",
  })
  @Column({
    type: ColumnType.ObjectID,
    nullable: true,
    transformer: ObjectID.getDatabaseTransformer(),
  })
  public providerId?: ObjectID = undefined;
}

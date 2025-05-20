using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class Domain5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SurgeryRoom_SurgeryRoomStatus_CurrentStatusId",
                table: "SurgeryRoom");

            migrationBuilder.DropForeignKey(
                name: "FK_SurgeryRoom_SurgeryRoomType_TypeId",
                table: "SurgeryRoom");

            migrationBuilder.DropTable(
                name: "SurgeryRoomStatus");

            migrationBuilder.DropTable(
                name: "SurgeryRoomType");

            migrationBuilder.DropIndex(
                name: "IX_SurgeryRoom_CurrentStatusId",
                table: "SurgeryRoom");

            migrationBuilder.DropIndex(
                name: "IX_SurgeryRoom_TypeId",
                table: "SurgeryRoom");

            migrationBuilder.DropColumn(
                name: "Capacity",
                table: "SurgeryRoom");

            migrationBuilder.DropColumn(
                name: "CurrentStatusId",
                table: "SurgeryRoom");

            migrationBuilder.DropColumn(
                name: "TypeId",
                table: "SurgeryRoom");

            migrationBuilder.RenameColumn(
                name: "AssignedEquipment",
                table: "SurgeryRoom",
                newName: "Description");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SurgeryRoom",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "SurgeryRoom",
                type: "char(8)",
                fixedLength: true,
                maxLength: 8,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "ForSurgery",
                table: "SurgeryRoom",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "SurgeryRoom",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryRoom_Code",
                table: "SurgeryRoom",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SurgeryRoom_Code",
                table: "SurgeryRoom");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "SurgeryRoom");

            migrationBuilder.DropColumn(
                name: "ForSurgery",
                table: "SurgeryRoom");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "SurgeryRoom");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "SurgeryRoom",
                newName: "AssignedEquipment");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SurgeryRoom",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddColumn<int>(
                name: "Capacity",
                table: "SurgeryRoom",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CurrentStatusId",
                table: "SurgeryRoom",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TypeId",
                table: "SurgeryRoom",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SurgeryRoomStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryRoomStatus", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SurgeryRoomType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgeryRoomType", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryRoom_CurrentStatusId",
                table: "SurgeryRoom",
                column: "CurrentStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_SurgeryRoom_TypeId",
                table: "SurgeryRoom",
                column: "TypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SurgeryRoom_SurgeryRoomStatus_CurrentStatusId",
                table: "SurgeryRoom",
                column: "CurrentStatusId",
                principalTable: "SurgeryRoomStatus",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_SurgeryRoom_SurgeryRoomType_TypeId",
                table: "SurgeryRoom",
                column: "TypeId",
                principalTable: "SurgeryRoomType",
                principalColumn: "Id");
        }
    }
}

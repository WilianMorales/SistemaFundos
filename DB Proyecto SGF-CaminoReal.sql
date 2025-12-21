CREATE DATABASE FundoCaminoReal;
GO

USE FundoCaminoReal;
GO

-- ROLES
CREATE TABLE Roles (
  Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name        NVARCHAR(50) NOT NULL UNIQUE,
  Description NVARCHAR(MAX) NULL,
  CreatedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- USUARIOS
CREATE TABLE Users (
  Id            UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name          NVARCHAR(150) NOT NULL,
  Email         NVARCHAR(150) NOT NULL UNIQUE,
  PasswordHash  NVARCHAR(255) NOT NULL,
  IsActive      BIT           NOT NULL DEFAULT 1,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

-- USUARIO-ROL
CREATE TABLE UserRoles (
  UserId     UNIQUEIDENTIFIER NOT NULL,
  RoleId     UNIQUEIDENTIFIER NOT NULL,
  AssignedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
  CONSTRAINT FK_UserRoles_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
  CONSTRAINT FK_UserRoles_Role FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

-- CATALOGO HABITACIONES
CREATE TABLE RoomTypes (
  Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name        NVARCHAR(150) NOT NULL,
  Description NVARCHAR(MAX) NULL,
  BasePrice   DECIMAL(10,2) NOT NULL,
  Capacity    INT NOT NULL,
  IsActive    BIT NOT NULL DEFAULT 1,
  CreatedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- CATALOGO ESPACIOS EVENTOS
CREATE TABLE EventSpaces (
  Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name        NVARCHAR(150) NOT NULL,
  Description NVARCHAR(MAX) NULL,
  BaseRent    DECIMAL(10,2) NOT NULL,
  MaxCapacity INT NOT NULL,
  IsActive    BIT NOT NULL DEFAULT 1,
  CreatedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- POLÍTICAS CANCELACIÓN
CREATE TABLE CancellationPolicies (
  Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name        NVARCHAR(150) NOT NULL,
  Description NVARCHAR(MAX) NULL,
  IsActive    BIT NOT NULL DEFAULT 1,
  CreatedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE CancellationRules (
  Id             UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  PolicyId       UNIQUEIDENTIFIER NOT NULL,
  MinDays        INT NOT NULL,
  RefundPercent  INT NOT NULL,
  CONSTRAINT FK_CancelRule_Policy FOREIGN KEY (PolicyId)
    REFERENCES CancellationPolicies(Id) ON DELETE CASCADE
);

-- CUPONES / PROMOS
CREATE TABLE Coupons (
  Id             UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Code           NVARCHAR(50) NOT NULL UNIQUE,
  Name           NVARCHAR(150) NOT NULL,
  Description    NVARCHAR(MAX) NULL,
  DiscountType   NVARCHAR(20) NOT NULL,        -- 'percent' | 'fixed'
  DiscountValue  DECIMAL(10,2) NOT NULL,
  ValidFrom      DATE NOT NULL,
  ValidTo        DATE NOT NULL,
  MaxUses        INT NULL,
  IsActive       BIT NOT NULL DEFAULT 1,
  CreatedAt      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- TEMPORADAS
CREATE TABLE Seasons (
  Id          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  Name        NVARCHAR(150) NOT NULL,
  StartDate   DATE NOT NULL,
  EndDate     DATE NOT NULL,
  Multiplier  DECIMAL(5,2) NOT NULL,
  CreatedAt   DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE RoomSeasonPrices (
  Id             UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  RoomTypeId     UNIQUEIDENTIFIER NOT NULL,
  SeasonId       UNIQUEIDENTIFIER NOT NULL,
  OverridePrice  DECIMAL(10,2) NULL,
  Multiplier     DECIMAL(5,2)  NULL,
  CONSTRAINT FK_Rsp_RoomType FOREIGN KEY (RoomTypeId) REFERENCES RoomTypes(Id) ON DELETE CASCADE,
  CONSTRAINT FK_Rsp_Season   FOREIGN KEY (SeasonId)   REFERENCES Seasons(Id)   ON DELETE CASCADE
);

-- RESERVAS
CREATE TABLE Bookings (
  Id                    UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  UserId                UNIQUEIDENTIFIER NOT NULL,
  Type                  NVARCHAR(10) NOT NULL,         -- 'room' | 'event'
  Estado                VARCHAR(20) DEFAULT 'confirmada',         -- 'confirmada' | 'cancelada'
  ReservationCode       NVARCHAR(50) NOT NULL UNIQUE,
  CouponId              UNIQUEIDENTIFIER NULL,
  DiscountAmount        DECIMAL(10,2) DEFAULT 0,
  CancellationPolicyId  UNIQUEIDENTIFIER NULL,
  CreatedAt             DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedAt             DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_Bookings_User          FOREIGN KEY (UserId)               REFERENCES Users(Id),
  CONSTRAINT FK_Booking_Coupon         FOREIGN KEY (CouponId)             REFERENCES Coupons(Id),
  CONSTRAINT FK_Booking_CancelPolicy   FOREIGN KEY (CancellationPolicyId) REFERENCES CancellationPolicies(Id)
);

-- DETALLE HABITACIONES
CREATE TABLE RoomBookings (
  BookingId      UNIQUEIDENTIFIER PRIMARY KEY,
  RoomTypeId     UNIQUEIDENTIFIER NULL,
  Habitacion     NVARCHAR(150) NOT NULL,
  CheckIn        DATE NOT NULL,
  CheckOut       DATE NOT NULL,
  Huespedes      INT NOT NULL,
  Noches         INT NOT NULL,
  PrecioXNoche   DECIMAL(10,2) NOT NULL,
  CONSTRAINT FK_RoomBooking_Booking FOREIGN KEY (BookingId)  REFERENCES Bookings(Id)   ON DELETE CASCADE,
  CONSTRAINT FK_RoomBooking_Type    FOREIGN KEY (RoomTypeId) REFERENCES RoomTypes(Id)
);

-- DETALLE EVENTOS
CREATE TABLE EventBookings (
  BookingId     UNIQUEIDENTIFIER PRIMARY KEY,
  EventSpaceId  UNIQUEIDENTIFIER NULL,
  TipoEvento    NVARCHAR(150) NOT NULL,
  Espacio       NVARCHAR(150) NOT NULL,
  Fecha         DATE NOT NULL,
  Hora          NVARCHAR(10) NOT NULL,
  Duracion      NVARCHAR(10) NOT NULL,
  Invitados     INT NOT NULL,
  RentaEspacio  DECIMAL(10,2) NOT NULL,
  CONSTRAINT FK_EventBooking_Booking FOREIGN KEY (BookingId)   REFERENCES Bookings(Id)    ON DELETE CASCADE,
  CONSTRAINT FK_EventBooking_Space   FOREIGN KEY (EventSpaceId) REFERENCES EventSpaces(Id)
);

-- PAGOS
CREATE TABLE Payments (
  Id               UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  BookingId        UNIQUEIDENTIFIER NOT NULL,
  Method           NVARCHAR(50) NOT NULL,
  Amount           DECIMAL(10,2) NOT NULL,
  Currency         NVARCHAR(10)  NOT NULL,
  ReservationCode  NVARCHAR(50)  NOT NULL,
  PaidAt           DATETIME2     NOT NULL,
  CustomerName     NVARCHAR(150) NOT NULL,
  CustomerEmail    NVARCHAR(150) NOT NULL,
  CustomerPhone    NVARCHAR(50)  NOT NULL,
  CONSTRAINT FK_Payment_Booking FOREIGN KEY (BookingId) REFERENCES Bookings(Id) ON DELETE CASCADE,
  CONSTRAINT UQ_Payments_ReservationCode UNIQUE (ReservationCode)
);

#define MyAppName "VALORANT Inventory Manager"
#define MyAppVersion "1.0.0b3"
#define MyAppPublisher "colinhartigan"
#define MyAppURL "https://github.com/colinhartigan/valorant-inventory-manager/"
#define MyAppExeName "VIM.exe"

[Setup]
AppId={{EC6B5079-8072-43DA-AD7E-106F4659E381}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
;AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
LicenseFile=info\license.txt
InfoBeforeFile=info\pre-install.txt
; Remove the following line to run in administrative install mode (install for all users.)
PrivilegesRequired=lowest
OutputDir=build
OutputBaseFilename=setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern

[Code]
procedure StartBrowserClient();
var
  ResultCode: Integer;
begin
  Exec('cmd.exe', '/c START /WAIT VIM.exe; START /MAX https://colinhartigan.github.io/valorant-inventory-manager', '', SW_HIDE, ewNoWait, ResultCode);
end;

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "german"; MessagesFile: "compiler:Languages\German.isl"
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "..\dists\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

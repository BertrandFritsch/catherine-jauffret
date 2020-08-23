function Get-FileMimeType {
  [cmdletbinding()]
  param (
    [Parameter(Mandatory=$True, ValueFromPipeline=$true)]
    [ValidateNotNullOrEmpty()]
    [string] $Path
  )

  if (-not (Get-PSDrive -Name HKCR -ErrorAction SilentlyContinue)) {
    Write-Verbose 'Creating the HKCR drive'
    New-PSDrive -PSProvider registry -Root HKEY_CLASSES_ROOT -Name HKCR | Out-Null
  }

  $ext = (Get-Item $Path).Extension
  Write-Verbose "Getting the mime-type of '$ext'"
  (Get-ItemProperty HKCR:\$ext -Name 'Content Type').'Content Type'
}

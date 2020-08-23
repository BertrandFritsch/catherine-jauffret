function Get-DateTaken
{
  [cmdletbinding()]
  param 
  (
    [Parameter(ValueFromPipeline=$true, ValueFromPipelineByPropertyName=$true)]
    [Alias('FullName')]
    [String]
    $Path
  )
  
  begin
  {
    $shell = New-Object -COMObject Shell.Application
  }
  
  process
  {
    $name = Split-Path $path -Leaf
    $folder = Split-Path $path
    $shellfolder = $shell.Namespace($folder)
    $shellfile = $shellfolder.ParseName($name)
    $dt = $shellfolder.GetDetailsOf($shellfile, 12)

    $dt ? (Get-Date ($dt -replace '^\D+(\d{2})/\D+(\d{2})/\D+(\d{4})\D+(\d{2}):(\d{2})','$1/$2/$3 $4:$5')) : $null
  }
}

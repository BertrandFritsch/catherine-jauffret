function Get-DateTaken
{
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
  $returnvalue = 1 | Select-Object -Property Name, DateTaken, Folder
    $returnvalue.Name = Split-Path $path -Leaf
    $returnvalue.Folder = Split-Path $path
    $shellfolder = $shell.Namespace($returnvalue.Folder)
    $shellfile = $shellfolder.ParseName($returnvalue.Name)
    $returnvalue.DateTaken = $shellfolder.GetDetailsOf($shellfile, 12)

    $returnvalue
  }
}

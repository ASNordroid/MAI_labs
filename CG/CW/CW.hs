import Control.Monad       ( when )
import Data.Char           ( toLower )
import Data.IORef          ( IORef, newIORef )
import Foreign.Marshal     ( withArray )
import System.Directory    ( getHomeDirectory )
import System.Exit         ( exitWith, ExitCode(ExitSuccess) )

import Graphics.UI.GLUT

data State = State { showPoints :: IORef Bool
                   , spin       :: IORef Int
                   , scal       :: IORef Int }

makeState :: IO State
makeState = do
   s  <- newIORef False
   t  <- newIORef 0
   sc <- newIORef 4
   return $ State { showPoints = s
                  , spin = t
                  , scal = sc }

ctlPoints :: [[Vertex3 GLfloat]]
ctlPoints =
   [ [ Vertex3 (2 * u - 3)
               (2 * v - 3)
               (if (u == 1 || u == 2) && (v == 1 || v == 2) then 3 else -3)
     | v <- [ 0 .. 3 ] ]
   | u <- [ 0 .. 3 ]]

myInit :: IO ()
myInit = do
   clearColor $= Color4 1 1 1 0
   materialDiffuse   Front $= Color4 0.2 0.5 0.9 1
   materialSpecular  Front $= Color4 1 1 0.9 1
   materialShininess Front $= 200

   lighting        $= Enabled
   light (Light 0) $= Enabled
   depthFunc       $= Just Less
   autoNormal      $= Enabled
   normalize       $= Enabled

display :: State -> DisplayCallback
display state = do
   k <- readFromFile
   let knots = k :: [GLfloat]
   clear [ ColorBuffer, DepthBuffer ]
   preservingMatrix $ do
      t <- get (spin state)
      rotate (fromIntegral t :: GLdouble) (Vector3 0 1 1)
      get (scal state) >>= \s ->
         if s > 0 && s < 9 then do
            let sc = 0.1 * (fromIntegral s :: GLfloat)
            scale sc sc sc
         else do
            let sc = 0.1 :: GLfloat
            scale sc sc sc
      let l = fromIntegral (length knots) :: GLint
      withNURBSObj () $ \nurbsObj -> do
         setSamplingMethod nurbsObj (PathLength 20)
         setDisplayMode' nurbsObj Fill'
         checkForNURBSError nurbsObj $
            nurbsBeginEndSurface nurbsObj $
               withArray (concat ctlPoints) $ \cBuf ->
                  withArray knots $ \kBuf ->
                     nurbsSurface nurbsObj l kBuf l kBuf (4 * 3) 3 cBuf (fromIntegral (l `div` 2) :: GLint) (fromIntegral (l `div` 2) :: GLint)

      s <- get (showPoints state)
      when s $ do
         pointSize $= 5
         lighting $= Disabled
         color (Color3 1 1 (0 :: GLfloat))
         renderPrimitive Points $
            mapM_ (mapM_ vertex) ctlPoints
         lighting $= Enabled

   flush

reshape :: ReshapeCallback
reshape size@(Size w h) = do
   viewport $= (Position 0 0, size)
   matrixMode $= Projection
   loadIdentity
   perspective 45 (fromIntegral w / fromIntegral h) 3 8
   matrixMode $= Modelview 0
   loadIdentity
   translate (Vector3 0 0 (-6 :: GLfloat))

keyboardMouse :: State -> KeyboardMouseCallback
keyboardMouse state (MouseButton b) _ _ _ = case b of
   WheelUp   -> do
      scal state $~ (+ 1)
      postRedisplay Nothing
   WheelDown -> do
      scal state $~ ((* (-1)) . ((-) 1))
      postRedisplay Nothing
   _         -> return ()
keyboardMouse state (SpecialKey s) Down _ _ = case s of
   KeyLeft  -> do
      spin state $~ ((`mod` 360) . (+ 30))
      postRedisplay Nothing
   KeyRight -> do
      spin state $~ ((* (-1)) . (`mod` 360) . ((-) 30))
      postRedisplay Nothing
   _        -> return ()
keyboardMouse state (Char c) Down _ _ = case toLower c of
   'c'   -> do showPoints state $~ not; postRedisplay Nothing
   '\27' -> exitWith ExitSuccess
   _     -> return ()
keyboardMouse _ _ _ _ _ = return ()

readFromFile :: IO [GLfloat]
readFromFile = do
   dir <- getHomeDirectory
   s <- readFile (dir ++ "/points.txt")
   return $ f $ words s where
      f :: [String] -> [GLfloat]
      f = map (read)


main :: IO ()
main = do
   (progName, _args) <- getArgsAndInitialize
   initialDisplayMode    $= [ SingleBuffered, RGBMode, WithDepthBuffer ]
   initialWindowSize     $= Size 1024 768
   initialWindowPosition $= Position 100 100
   _     <- createWindow progName
   state <- makeState
   myInit
   reshapeCallback $= Just reshape
   displayCallback $= display state
   keyboardMouseCallback $= Just (keyboardMouse state)
   mainLoop

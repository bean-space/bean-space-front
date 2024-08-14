import { Typography, Grid, Box, IconButton } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DeleteIcon from "@mui/icons-material/Delete";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ImageUploader = ({ images, setImages }) => {
  const onDrop = (acceptedFiles, rejectedFiles) => {
    rejectedFiles.forEach((file) => {
      if (file.file.size > MAX_FILE_SIZE) {
        alert(
          `파일 '${file.file.name}'의 크기가 5MB를 초과합니다. 업로드할 수 없습니다.`
        );
      }
    });

    setImages((prevImages) => {
      const remainingSlots = MAX_IMAGES - prevImages.length;
      const newImages = acceptedFiles.slice(0, remainingSlots).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        url: URL.createObjectURL(file),
        file: file,
      }));
      return [...prevImages, ...newImages];
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg", ".jfif"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    disabled: images.length >= MAX_IMAGES,
    maxSize: MAX_FILE_SIZE,
  });

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const newImageList = [...prevImages];
      newImageList.splice(index, 1);
      return newImageList;
    });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        이미지 업로드 ({images.length}/{MAX_IMAGES})
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #eeeeee",
          borderRadius: "4px",
          padding: "20px",
          textAlign: "center",
          cursor: images.length >= MAX_IMAGES ? "not-allowed" : "pointer",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: images.length >= MAX_IMAGES ? "#f0f0f0" : "inherit",
        }}
      >
        <input {...getInputProps()} />
        {images.length >= MAX_IMAGES ? (
          <p>최대 이미지 개수에 도달했습니다</p>
        ) : isDragActive ? (
          <p>이미지를 여기에 놓으세요...</p>
        ) : (
          <p>
            이미지를 끌어오거나, 클릭해서 이미지를 업로드하세요 (최대{" "}
            {MAX_IMAGES}개)
          </p>
        )}
      </Box>
      {images.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1">업로드된 이미지:</Typography>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <Grid
                  container
                  spacing={1}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {images.map((image, index) => (
                    <Draggable
                      key={image.id}
                      draggableId={image.id}
                      index={index}
                    >
                      {(provided) => (
                        <Grid
                          item
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Box position="relative">
                            <img
                              src={image.url}
                              alt={`uploaded ${index}`}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                            <Box
                              position="absolute"
                              top={0}
                              left={0}
                              bgcolor="rgba(0,0,0,0.5)"
                              color="white"
                              width={24}
                              height={24}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="0 0 4px 0"
                            >
                              {index + 1}
                            </Box>
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "rgba(255,255,255,0.7)",
                              }}
                              onClick={() => removeImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      )}
    </>
  );
};

export default ImageUploader;

import { useState } from "react";
import { getPresignedUrl } from "../api/image";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  Modal,
  Divider,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DaumPostcode from "react-daum-postcode";
import ImageUploader from "./ImageUploader";
import axios from "axios";
import { createSpace, updateSpace } from "../api/host";
import { useNavigate } from "react-router-dom";
import { useOffer } from "../hooks/useOffer";

const HostSpaceFormContainer = ({ isEdit = false, initialData = null }) => {
  const [space, setSpace] = useState(
    initialData || {
      listingName: "",
      price: "",
      zipCode: "",
      streetNameAddress: "",
      detailedAddress: "",
      sidoAndSigungu: "",
      content: "",
      defaultPeople: 1,
      maxPeople: 1,
      pricePerPerson: "",
      bedRoomCount: 1,
      bedCount: 1,
      bathRoomCount: 1,
      offer: [],
    }
  );
  const [images, setImages] = useState(
    initialData?.imageUrlList.map((url, index) => ({
      id: index.toString(),
      url: url,
      file: null,
    })) || []
  );
  const { offerList } = useOffer();

  const [showPostcode, setShowPostcode] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate();

  const handleOpenConfirmDialog = (e) => {
    e.preventDefault();

    if (Object.values(space).some((value) => value === "")) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    if (space.maxPeople < space.defaultPeople) {
      alert("최대 인원은 기본 인원보다 크거나 같아야 합니다.");
      return;
    }

    if (images.length === 0) {
      alert("최소 1장의 사진을 업로드해주세요.");
      return;
    }

    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSpace({ ...space, [name]: value });
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.max(0, parseInt(value) || 0);
    setSpace({ ...space, [name]: numValue });
  };

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = value.replace(/[^\d]/g, "");
    const formattedValue = Number(numValue).toLocaleString();
    setSpace({ ...space, [name]: formattedValue });
  };

  const formatSidoAndSigungu = (sido, sigungu) => {
    const formattedSido = sido.replace(/(특별자치도|특별자치시)/, "").trim();

    return `${formattedSido} ${sigungu}`.trim();
  };

  const handlePostcodeComplete = (data) => {
    const sidoAndSigungu = formatSidoAndSigungu(data.sido, data.sigungu);

    setSpace({
      ...space,
      zipCode: data.zonecode,
      streetNameAddress: data.address,
      sidoAndSigungu: sidoAndSigungu,
    });
    setShowPostcode(false);
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    for (let image of images) {
      if (image.file) {
        try {
          const presignedUrl = await getPresignedUrl({
            fileName: image.file.name,
            contentType: image.file.type,
            imageType: "SPACE",
          });

          await axios.put(presignedUrl, image.file, {
            headers: {
              "Content-Type": image.file.type,
            },
          });

          const uploadedUrl = presignedUrl.split("?")[0];
          uploadedUrls.push(uploadedUrl);
        } catch (error) {
          alert("이미지 업로드에 실패하였습니다");
          throw error;
        }
      } else {
        uploadedUrls.push(image.url);
      }
    }
    return uploadedUrls;
  };

  const handleOfferChange = (offerId) => {
    setSpace((prevSpace) => ({
      ...prevSpace,
      offer: prevSpace.offer.includes(offerId)
        ? prevSpace.offer.filter((id) => id !== offerId)
        : [...prevSpace.offer, offerId],
    }));
  };

  const handleConfirmSubmit = async () => {
    try {
      const uploadedImageUrls = await uploadImages();

      const spaceData = {
        ...space,
        price:
          typeof space.price === "string"
            ? parseInt(space.price.replace(/,/g, ""))
            : space.price,
        pricePerPerson:
          typeof space.pricePerPerson === "string"
            ? parseInt(space.pricePerPerson.replace(/,/g, ""))
            : space.pricePerPerson,
        imageUrlList: uploadedImageUrls,
        offer: space.offer,
      };

      if (isEdit) {
        const {
          sidoAndSigungu,
          detailedAddress,
          streetNameAddress,
          zipCode,
          ...editedSpaceData
        } = spaceData;
        await updateSpace({ space: editedSpaceData, id: space.id });
      } else {
        await createSpace(spaceData);
      }

      handleCloseConfirmDialog();
      alert(
        isEdit
          ? "숙소가 성공적으로 수정되었습니다!"
          : "숙소가 성공적으로 등록되었습니다! 관리자의 승인 이후 예약이 시작됩니다."
      );
      navigate("/host/space");
    } catch (error) {
      if (error.response.data.msg) {
        alert(error.response.data.msg);
      } else {
        alert(
          isEdit ? "숙소 수정에 실패했습니다." : "숙소 등록에 실패했습니다."
        );
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        {isEdit ? "공간 수정하기" : "새로운 공간 등록하기"}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleOpenConfirmDialog}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="숙소 이름"
                    name="listingName"
                    value={space.listingName}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    숙소 가격 / 인원 정보
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="1박 당 가격"
                    name="price"
                    value={space.price}
                    onChange={handlePriceInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">원</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="1인당 추가 요금"
                    name="pricePerPerson"
                    value={space.pricePerPerson}
                    onChange={handlePriceInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">원</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="기본 인원"
                    name="defaultPeople"
                    type="number"
                    value={space.defaultPeople}
                    onChange={handleNumberInputChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="최대 인원"
                    name="maxPeople"
                    type="number"
                    value={space.maxPeople}
                    onChange={handleNumberInputChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>

                {isEdit ? (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      주소 정보
                    </Typography>
                    <Typography variant="body2" color="error" gutterBottom>
                      주소 정보는 수정할 수 없습니다
                      <br />
                      수정하려면 공간 삭제 후 다시 등록해주세요
                    </Typography>
                    <TextField
                      fullWidth
                      label="현재 등록된 주소"
                      value={`${space.sidoAndSigungu} ${space.zipCode} ${space.streetNameAddress} ${space.detailedAddress}`}
                      InputLabelProps={{
                        style: { color: "black" },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      disabled
                      sx={{
                        mt: 2,
                        bgcolor: "action.disabledBackground",
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        주소 정보
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        주소 정보를 입력하려면 '주소 검색' 버튼을 눌러주세요
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowPostcode(true)}
                        sx={{
                          mt: 1,
                          backgroundColor: "#F17D7B",
                          textShadow: "0.5px 0.5px 0.5px #000",
                          color: "white",
                          "&:hover": { backgroundColor: "#F05552" },
                        }}
                      >
                        주소 검색
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="우편번호"
                        InputLabelProps={{
                          style: { color: "black" },
                        }}
                        name="zipCode"
                        value={space.zipCode}
                        InputProps={{
                          readOnly: true,
                        }}
                        disabled
                        sx={{
                          bgcolor: "action.disabledBackground",
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="시/도 및 시/군/구"
                        InputLabelProps={{
                          style: { color: "black" },
                        }}
                        name="sidoAndSigungu"
                        value={space.sidoAndSigungu}
                        InputProps={{
                          readOnly: true,
                        }}
                        disabled
                        sx={{
                          bgcolor: "action.disabledBackground",
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="도로명 주소"
                        InputLabelProps={{
                          style: { color: "black" },
                        }}
                        name="streetNameAddress"
                        value={space.streetNameAddress}
                        InputProps={{
                          readOnly: true,
                        }}
                        disabled
                        sx={{
                          bgcolor: "action.disabledBackground",
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#000000",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="상세 주소"
                        name="detailedAddress"
                        value={space.detailedAddress}
                        onChange={handleInputChange}
                        placeholder="나머지 상세 주소를 입력해 주세요"
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    숙소 상세 정보
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="숙소 설명"
                    name="content"
                    multiline
                    rows={4}
                    value={space.content}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="침실 수"
                    name="bedRoomCount"
                    type="number"
                    value={space.bedRoomCount}
                    onChange={handleNumberInputChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="침대 수"
                    name="bedCount"
                    type="number"
                    value={space.bedCount}
                    onChange={handleNumberInputChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="욕실 수"
                    name="bathRoomCount"
                    type="number"
                    value={space.bathRoomCount}
                    onChange={handleNumberInputChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageUploader images={images} setImages={setImages} />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                편의시설 및 서비스
              </Typography>
              <Grid container spacing={2}>
                {offerList.map((offer) => (
                  <Grid item xs={6} sm={4} md={3} key={offer.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={space.offer.includes(offer.id)}
                          onChange={() => handleOfferChange(offer.id)}
                        />
                      }
                      label={offer.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    fontSize: "1rem",
                    textShadow: "#000 0.7px 0.5px 2px",
                    backgroundColor: "#87CEEB",
                    "&:hover": { backgroundColor: "#2AAADE" },
                  }}
                >
                  {isEdit ? "숙소 수정하기" : "숙소 등록하기"}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Modal
        open={showPostcode}
        onClose={() => setShowPostcode(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <DaumPostcode onComplete={handlePostcodeComplete} />
        </Box>
      </Modal>
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isEdit ? "숙소 수정 확인" : "숙소 등록 확인"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isEdit
              ? "입력하신 정보로 숙소를 수정하시겠습니까?"
              : "입력하신 정보로 숙소를 등록하시겠습니까?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>취소</Button>
          <Button onClick={handleConfirmSubmit} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HostSpaceFormContainer;
